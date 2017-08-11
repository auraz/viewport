import logging

from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
from django.core import serializers
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from .models import Address, AddressSerializer


logger = logging.getLogger(__name__)


class AddressList(APIView):
    """
    Partial REST view for list of addresses: get and delete
    """
    def get(self, request, *args, **kwargs):
        addresses  = Address.objects.all()
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)

    def delete(self, request, format=None):
        Address.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AddressDetail(APIView):
    """
    Partial REST view for Address model: create, others methods not needed now.
    """
    def post(self, request):
        """
        Save new unique address. Use address as unique identifier.
        """
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            if not Address.objects.filter(address=serializer.validated_data['address']).exists():
                Address.objects.create(**serializer.validated_data)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({})  # default is 200 OK
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def main(request):
    """
    Render initial view and pass google auth parameters.
    """
    context = {
        'g_api_key': settings.G_API_KEY,
        'fusion_table_id': settings.FUSION_TABLE_ID,
        'g_client_id': settings.G_CLIENT_ID
    }
    return  render(request, 'main.html', context)

