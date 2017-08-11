from __future__ import unicode_literals

from django.db import models
from rest_framework import serializers


class Address(models.Model):
    """
    Model to store lat, lon, address.
    """
    lat = models.FloatField()
    lng = models.FloatField()
    address = models.CharField(max_length=255)


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ('lat', 'lng', 'address')
