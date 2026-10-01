from django.urls import path

from . import api_views

app_name = 'catalog_api'

urlpatterns = [
    path('categories/', api_views.CategoryListView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', api_views.CategoryDetailView.as_view(), name='category-detail'),
    path('products/', api_views.ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', api_views.ProductDetailView.as_view(), name='product-detail'),
    path('products/<slug:slug>/favorite/', api_views.ToggleFavoriteView.as_view(), name='toggle-favorite'),
    path('favorites/', api_views.FavoritesListView.as_view(), name='favorites'),
]
