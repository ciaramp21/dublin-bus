from django.urls import path
from . import views

urlpatterns = [
    path('stops', views.stops, name='stops'),
    path('routes', views.routes, name='routes'),
    path('routes/<slug:route_id>/directions', views.directions, name='directions'),
    path('routes/<slug:route_id>/directions/<slug:direction_id>/boarding', views.boarding, name='boarding'),
    path('routes/<slug:route_id>/directions/<slug:direction_id>/boarding/<int:boarding_id>/alighting', views.alighting, name='alighting'),
    path('price', views.price, name='price'),
    path('weather', views.weather, name='weather'),
    path('leap', views.leap, name='leap'),
    path('predict', views.predict, name='predict'),
]

