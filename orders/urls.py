from django.urls import path

from . import views

app_name = "orders"

urlpatterns = [
    path("commander/", views.checkout, name="checkout"),
    path("commande/<int:order_id>/confirmation/", views.confirmation, name="confirmation"),
    path("mes-commandes/", views.order_list, name="list"),
]
