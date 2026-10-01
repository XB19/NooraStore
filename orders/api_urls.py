from django.urls import path

from . import api_views

app_name = 'orders_api'

urlpatterns = [
    path('checkout/', api_views.CheckoutView.as_view(), name='checkout'),
    path('', api_views.OrderListView.as_view(), name='list'),
    path('<int:order_id>/', api_views.OrderDetailView.as_view(), name='detail'),
]
