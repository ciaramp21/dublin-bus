from rest_framework import serializers
from .models import *


class ReactSerializer(serializers.ModelSerializer):
    class Meta:
        model = TfiStops
        fields = ['stop_id', 'stop_name', 'stop_lat', 'stop_lon']
