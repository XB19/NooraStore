from django.urls import path

from . import views

app_name = "catalog"

urlpatterns = [
    path("catalogue/", views.catalogue, name="catalogue"),
    path("favoris/", views.favorites_list, name="favorites"),
    path("produit/<slug:slug>/favori/", views.toggle_favorite, name="toggle-favorite"),
    path("produit/<slug:slug>/", views.product_detail, name="product-detail"),
    path("<slug:slug>/", views.category_detail, name="category-detail"),
]
