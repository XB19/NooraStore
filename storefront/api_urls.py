from django.urls import path

from . import api_views

app_name = 'storefront_api'

urlpatterns = [
    path('home/', api_views.HomeView.as_view(), name='home'),
    path('contact/', api_views.ContactSubmitView.as_view(), name='contact'),
]
