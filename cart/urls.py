from django.urls import path

from . import views

app_name = "cart"

urlpatterns = [
    path("", views.cart_detail, name="detail"),
    path("ajouter/<slug:slug>/", views.cart_add, name="add"),
    path("article/<int:item_id>/modifier/", views.cart_update, name="update"),
    path("article/<int:item_id>/supprimer/", views.cart_remove, name="remove"),
]
