"""viewport URL Configuration"""
from django.conf.urls import url, include
from django.contrib import admin

from locations import views


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^address/$', views.AddressDetail.as_view()),
    url(r'^addresslist/$', views.AddressList.as_view()),

    url(r'^$', views.main, name='main'),
]
