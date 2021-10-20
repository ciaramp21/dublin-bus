# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()
    fare_type = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class BusResults(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=20)
    directions = models.CharField(max_length=200)
    prediction = models.CharField(max_length=200)

    class Meta:
        managed = False
        db_table = 'bus_results'


class CurrentEvents(models.Model):

    class Meta:
        managed = False
        db_table = 'current_events'


class CurrentTraffic(models.Model):
    stop = models.ForeignKey('TfiStops', models.DO_NOTHING)
    confidence = models.IntegerField()
    current_speed = models.IntegerField()
    current_travel_time = models.IntegerField()
    frc = models.CharField(max_length=25, blank=True, null=True)
    free_flow_speed = models.IntegerField()
    free_flow_travel_time = models.IntegerField()
    road_closure = models.IntegerField(blank=True, null=True)
    timestamp = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'current_traffic'


class CurrentWeather(models.Model):
    date = models.DateTimeField(blank=True, null=True)
    temp = models.CharField(max_length=5, blank=True, null=True)
    feels_like = models.FloatField(blank=True, null=True)
    wind_speed = models.FloatField(blank=True, null=True)
    clouds_all = models.IntegerField(blank=True, null=True)
    weather_id = models.IntegerField(blank=True, null=True)
    weather_main = models.CharField(max_length=20, blank=True, null=True)
    weather_description = models.CharField(max_length=45, blank=True, null=True)
    sunrise = models.DateTimeField(blank=True, null=True)
    sunset = models.DateTimeField(blank=True, null=True)
    icon = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'current_weather'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class DublinBusRoutes(models.Model):
    dublin_bus_routes_id = models.AutoField(primary_key=True)
    stopsequence = models.IntegerField(db_column='StopSequence')  # Field name made lowercase.
    routename = models.CharField(db_column='RouteName', max_length=5, blank=True, null=True)  # Field name made lowercase.
    routedescription = models.CharField(db_column='RouteDescription', max_length=45, blank=True, null=True)  # Field name made lowercase.
    direction = models.CharField(db_column='Direction', max_length=5, blank=True, null=True)  # Field name made lowercase.
    platecode = models.IntegerField(db_column='PlateCode')  # Field name made lowercase.
    shortcommonname_en = models.CharField(db_column='ShortCommonName_en', max_length=25, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'dublin_bus_routes'


class LeapCardLocations(models.Model):
    leap_card_locations_id = models.AutoField(primary_key=True)
    shop_name = models.CharField(max_length=45, blank=True, null=True)
    town = models.CharField(max_length=25, blank=True, null=True)
    latitude = models.DecimalField(max_digits=65, decimal_places=13, blank=True, null=True)
    longitude = models.DecimalField(max_digits=65, decimal_places=15, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'leap_card_locations'


class TfiAgency(models.Model):
    agency_id = models.IntegerField(blank=True, null=True)
    agency_name = models.CharField(max_length=45, blank=True, null=True)
    agency_url = models.CharField(max_length=45, blank=True, null=True)
    agency_timezone = models.CharField(max_length=45, blank=True, null=True)
    agency_lang = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tfi_agency'


class TfiCalendar(models.Model):
    service_id = models.CharField(max_length=45, blank=True, null=True)
    monday = models.IntegerField(blank=True, null=True)
    tuesday = models.IntegerField(blank=True, null=True)
    wednesday = models.IntegerField(blank=True, null=True)
    thursday = models.IntegerField(blank=True, null=True)
    friday = models.IntegerField(blank=True, null=True)
    saturday = models.IntegerField(blank=True, null=True)
    sunday = models.IntegerField(blank=True, null=True)
    start_date = models.IntegerField(blank=True, null=True)
    end_date = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tfi_calendar'


class TfiCalendarDates(models.Model):
    service_id = models.CharField(max_length=45, blank=True, null=True)
    date = models.IntegerField(blank=True, null=True)
    exception_type = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tfi_calendar_dates'


class TfiRealtime(models.Model):
    id = models.BigIntegerField(blank=True, null=True)
    timestamp = models.TextField(blank=True, null=True)
    start_time = models.TextField(blank=True, null=True)
    start_date = models.TextField(blank=True, null=True)
    trip_id = models.TextField(blank=True, null=True)
    route_id = models.TextField(blank=True, null=True)
    schedule_relationship = models.TextField(blank=True, null=True)
    stop_id = models.TextField(blank=True, null=True)
    stop_sequence = models.BigIntegerField(blank=True, null=True)
    arrival_delay = models.FloatField(blank=True, null=True)
    arrival_time = models.FloatField(blank=True, null=True)
    departure_delay = models.FloatField(blank=True, null=True)
    departure_time = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tfi_realtime'


class TfiRouteStops(models.Model):
    route = models.ForeignKey('TfiRoutes', models.DO_NOTHING)
    stop = models.ForeignKey('TfiStops', models.DO_NOTHING)
    stop_number = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'tfi_route_stops'
        unique_together = (('route', 'stop'),)


class TfiRoutes(models.Model):
    route_id = models.CharField(max_length=45, blank=True, null=True)
    agency_id = models.IntegerField(blank=True, null=True)
    route_short_name = models.CharField(max_length=45, blank=True, null=True)
    route_long_name = models.CharField(max_length=250, blank=True, null=True)
    route_type = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tfi_routes'


class TfiShapes(models.Model):
    shape_id = models.CharField(max_length=45, blank=True, null=True)
    shape_pt_lat = models.FloatField(blank=True, null=True)
    shape_pt_lon = models.FloatField(blank=True, null=True)
    shape_pt_sequence = models.IntegerField(blank=True, null=True)
    shape_dist_traveled = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tfi_shapes'


class TfiStationDistance(models.Model):
    pk_id = models.BigIntegerField(blank=True, null=True)
    lineid = models.TextField(db_column='LINEID', blank=True, null=True)  # Field name made lowercase.
    routeid = models.TextField(db_column='ROUTEID', blank=True, null=True)  # Field name made lowercase.
    direction = models.BigIntegerField(db_column='DIRECTION', blank=True, null=True)  # Field name made lowercase.
    progrnumber = models.BigIntegerField(db_column='PROGRNUMBER', blank=True, null=True)  # Field name made lowercase.
    stopid = models.TextField(db_column='STOPID', blank=True, null=True)  # Field name made lowercase.
    prev_stopid = models.TextField(db_column='PREV_STOPID', blank=True, null=True)  # Field name made lowercase.
    distance_travelled = models.FloatField(db_column='DISTANCE_TRAVELLED', blank=True, null=True)  # Field name made lowercase.
    dist_between = models.FloatField(db_column='DIST_BETWEEN', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'tfi_station_distance'


class TfiStopTimes(models.Model):
    id = models.BigIntegerField(blank=True, null=True)
    trip_id = models.TextField(blank=True, null=True)
    arrival_time = models.TextField(blank=True, null=True)
    departure_time = models.TextField(blank=True, null=True)
    stop_id = models.TextField(blank=True, null=True)
    stop_sequence = models.BigIntegerField(blank=True, null=True)
    stop_headsign = models.TextField(blank=True, null=True)
    pickup_type = models.BigIntegerField(blank=True, null=True)
    drop_off_type = models.BigIntegerField(blank=True, null=True)
    shape_dist_traveled = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tfi_stop_times'


class TfiStops(models.Model):
    stop_id = models.CharField(max_length=45)
    stop_name = models.CharField(max_length=250, blank=True, null=True)
    stop_lat = models.FloatField(blank=True, null=True)
    stop_lon = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tfi_stops'
        unique_together = (('id', 'stop_id'),)


class TfiStopsPerRoute(models.Model):
    pk_id = models.BigIntegerField(blank=True, null=True)
    lineid = models.TextField(db_column='LINEID', blank=True, null=True)  # Field name made lowercase.
    routeid = models.TextField(db_column='ROUTEID', blank=True, null=True)  # Field name made lowercase.
    direction = models.BigIntegerField(db_column='DIRECTION', blank=True, null=True)  # Field name made lowercase.
    total_stops = models.BigIntegerField(db_column='TOTAL_STOPS', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'tfi_stops_per_route'


class TfiTimetableHistoric(models.Model):
    pk_id = models.BigIntegerField(blank=True, null=True)
    lineid = models.TextField(db_column='LINEID', blank=True, null=True)  # Field name made lowercase.
    routeid = models.TextField(db_column='ROUTEID', blank=True, null=True)  # Field name made lowercase.
    direction = models.BigIntegerField(db_column='DIRECTION', blank=True, null=True)  # Field name made lowercase.
    progrnumber = models.BigIntegerField(db_column='PROGRNUMBER', blank=True, null=True)  # Field name made lowercase.
    stoppointid = models.BigIntegerField(db_column='STOPPOINTID', blank=True, null=True)  # Field name made lowercase.
    plannedtime_dep = models.TextField(db_column='PLANNEDTIME_DEP', blank=True, null=True)  # Field name made lowercase.
    weekday = models.TextField(db_column='WEEKDAY', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'tfi_timetable_historic'


class TfiTrips(models.Model):
    route_id = models.CharField(max_length=45, blank=True, null=True)
    service_id = models.CharField(max_length=45, blank=True, null=True)
    trip_id = models.CharField(max_length=45)
    shape_id = models.CharField(max_length=45, blank=True, null=True)
    trip_headsign = models.CharField(max_length=250, blank=True, null=True)
    direction_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tfi_trips'
        unique_together = (('id', 'trip_id'),)


class TrafficIncidents(models.Model):

    class Meta:
        managed = False
        db_table = 'traffic_incidents'


class Weather4DayHourlyForecast(models.Model):
    date = models.DateTimeField(unique=True, blank=True, null=True)
    temp = models.FloatField(blank=True, null=True)
    feels_like = models.FloatField(blank=True, null=True)
    wind_speed = models.FloatField(blank=True, null=True)
    clouds_all = models.BigIntegerField(blank=True, null=True)
    weather_id = models.BigIntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    main_description = models.TextField(blank=True, null=True)
    icon = models.TextField(blank=True, null=True)
    sunrise = models.DateTimeField(blank=True, null=True)
    sunset = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'weather_4_day_hourly_forecast'
