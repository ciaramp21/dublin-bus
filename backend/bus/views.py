from django.http import JsonResponse
import requests
from .models import *
from datetime import datetime
from rest_framework_simplejwt.backends import TokenBackend
import toolz
import pandas as pd
import pickle
import os
from django.conf import settings
from django.db import connection
import glob
import re


pickle_files = glob.glob("bus/pickle/*")
models = {}

for pickle_file in pickle_files:
    with open(os.path.join(settings.BASE_DIR, pickle_file), 'rb') as handle:
        p = re.compile("bus/pickle/xgb_reg_model_(.*)\.pkl")
        route_id = p.search(pickle_file).group(1)
        models[route_id] = pickle.load(handle)

# USE THIS IF ON WINDOWS AND COMMENT OUT THE ABOVE
# pickle_files = glob.glob("bus\pickle\*")
# models = {}

# for pickle_file in pickle_files:
#     with open(os.path.join(settings.BASE_DIR, pickle_file), 'rb') as handle:
#         p = re.compile("bus\\\\pickle\\\\xgb_reg_model_(.*)\.pkl")
#         route_id = p.search(pickle_file).group(1)
#         models[route_id] = pickle.load(handle)


def stops(request):
    all_stops = [{"id": stop.stop_id, "name": stop.stop_name, "stop_lat": stop.stop_lat, "stop_lon": stop.stop_lon}
                 for stop in TfiStops.objects.all()]

    return JsonResponse({'stops': all_stops})


def leap(request):
    leap_locations = [
        {"leap_card_locations_id": leap.leap_card_locations_id, "shop_name": leap.shop_name, "town": leap.town,
         "latitude": leap.latitude, "longitude": leap.longitude}
        for leap in LeapCardLocations.objects.all()]

    return JsonResponse({'leap': leap_locations})


def routes(request):
    return JsonResponse({'routes': list(DublinBusRoutes.objects.values('routename').order_by('routename').distinct())})


def directions(request, route_id):
    route_directions = [
        {"id": route.dublin_bus_routes_id, "busnumber": route.routename, "routedescription": route.routedescription,
         "direction": route.direction, "platecode": route.platecode, "shortcommonname_en": route.shortcommonname_en}
        for route in DublinBusRoutes.objects.filter(routename=route_id, stopsequence=1).order_by('direction')]
    return JsonResponse({'directions': route_directions})


def boarding(request, route_id, direction_id):
    boarding_stops = [
        {"id": route.dublin_bus_routes_id, "busnumber": route.routename, "routedescription": route.routedescription,
         "direction": route.direction, "platecode": route.platecode, "shortcommonname_en": route.shortcommonname_en,
         "stopsequence": route.stopsequence, "lat": route.lat, "lon": route.lon}
        for route in
        DublinBusRoutes.objects.filter(routename=route_id, direction=direction_id).order_by('dublin_bus_routes_id',
                                                                                            'stopsequence')]
    toolz.unique(boarding_stops, key=lambda x: x.platecode)
    return JsonResponse({'boarding': boarding_stops})


def alighting(request, route_id, direction_id, boarding_id):
    boarding_stop = \
        DublinBusRoutes.objects.filter(routename=route_id, direction=direction_id, platecode=boarding_id).order_by(
            'dublin_bus_routes_id')[0]
    alighting_stops = [
        {"id": route.dublin_bus_routes_id, "busnumber": route.routename, "routedescription": route.routedescription,
         "direction": route.direction, "platecode": route.platecode, "shortcommonname_en": route.shortcommonname_en,
         "stopsequence": route.stopsequence, "lat": route.lat, "lon": route.lon}
        for route in DublinBusRoutes.objects.filter(routename=route_id, direction=direction_id,
                                                    stopsequence__gt=boarding_stop.stopsequence).order_by(
            'dublin_bus_routes_id', 'stopsequence')]
    toolz.unique(alighting_stops, key=lambda x: x.platecode)
    return JsonResponse({'alighting': alighting_stops})


def price(request):
    profile = None
    if request.META.get('HTTP_AUTHORIZATION'):
        token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1]
        data = TokenBackend(algorithm='HS256').decode(token, verify=False)
        user_id = (data['user_id'])
        profile = AuthUser.objects.get(pk=user_id)
    route = request.GET.get('route')
    direction = request.GET.get('direction')
    start = request.GET.get('start')
    end = request.GET.get('end')
    fare = request.GET.get('fare')
    url = 'https://dublinbus.ie/api/FareCalculateService/{route}/{direction}/{start}/{end}?format=json'.format(
        route=route,
        direction=direction,
        start=start,
        end=end)
    response = requests.get(url)
    fares = response.json()

    if profile:
        if profile.fare_type == 'Adult':
            return JsonResponse(
                {"cash": next((x for x in fares['Fares'] if x['FareCategoryName'] == 'Adult Cash'), None)['Cost'],
                 "leap": next((x for x in fares['Fares'] if x['FareCategoryName'] == 'Adult Leap'), None)['Cost']})
        if profile.fare_type == 'Child (Under 19)':
            return JsonResponse(
                {"cost": next((x for x in fares['Fares'] if x['FareCategoryName'] == 'Child Leap (Under 19)'), None)[
                    'Cost']})
        if profile.fare_type == 'Child (Under 16)':
            return JsonResponse(
                {"cost": next((x for x in fares['Fares'] if x['FareCategoryName'] == 'Child Cash (Under 16)'), None)[
                    'Cost']})

    return JsonResponse({"cost": next((x for x in fares['Fares'] if x['FareCategoryName'] == fare), None)['Cost']})


def predict(request):
    route_id = request.GET.get('route')
    boarding_id = request.GET.get('boarding')
    alighting_id = request.GET.get('alighting')
    stops = int(request.GET.get('stops')) + 1
    day = request.GET.get('day')
    hour = request.GET.get('hour')
    temp = request.GET.get('temp')
    weather = request.GET.get('weather')

    if boarding_id and not alighting_id:
        boarding_stop = DublinBusRoutes.objects.filter(routename=route_id, platecode=boarding_id)[0]
        alighting_stop = DublinBusRoutes.objects.filter(routename=route_id, direction=boarding_stop.direction, stopsequence=boarding_stop.stopsequence + stops)[0]
        alighting_id = alighting_stop.platecode
    elif alighting_id and not boarding_id:
        alighting_stop = DublinBusRoutes.objects.filter(routename=route_id, platecode=alighting_id)[0]
        boarding_stop = DublinBusRoutes.objects.filter(routename=route_id, direction=alighting_stop.direction, stopsequence=alighting_stop.stopsequence - stops)[0]
        boarding_id = boarding_stop.platecode
    else:
        boarding_stop = DublinBusRoutes.objects.filter(routename=route_id, platecode=boarding_id)[0]
        alighting_stop = DublinBusRoutes.objects.filter(routename=route_id, platecode=alighting_id, direction=boarding_stop.direction)[0]

    direction_id = 2 if boarding_stop.direction == 'I' else 1

    with connection.cursor() as cursor:
        cursor.execute(
            "call get_distance_and_stops('{boarding_id}', '{alighting_id}', '{route_id}', '{direction_id}')".format(
                boarding_id=boarding_id, alighting_id=alighting_id, route_id=route_id, direction_id=direction_id))
        data = cursor.fetchone()
        stops_between = data[0]
        dist_between = data[1]

    df = pd.DataFrame(data=[[day, hour, 1, dist_between, stops_between, temp, weather]],
                      columns=['WEEKDAY', 'HOUR', 'DIRECTION', 'DIST_BETWEEN', 'STOPS_BETWEEN', 'temp', 'weather_main'])
    prediction = models[route_id].predict(df)[0]
    return JsonResponse({'prediction': prediction})


def weather(request):
    time = request.GET.get('time')
    f = '%Y-%m-%d %H:%M:%S'
    selected_date = datetime.strptime(time, f)

    response = [
        {"date": weather.date, "temp": weather.temp, "feels_like": weather.feels_like, "wind_speed": weather.wind_speed,
         "clouds_all": weather.clouds_all, "weather_id": weather.weather_id, "description": weather.description,
         "main_description": weather.main_description, "icon": weather.icon, "sunrise": weather.sunrise,
         "sunset": weather.sunset}
        for weather in Weather4DayHourlyForecast.objects.filter(date__gte=selected_date)]

    return JsonResponse({"weather": response[0]})
