from django.urls import path

from . import api_views

app_name = 'admin_panel_api'

urlpatterns = [
    path('dashboard/', api_views.DashboardView.as_view(), name='dashboard'),

    path('products/', api_views.ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', api_views.ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:pk>/images/', api_views.ProductImageListView.as_view(), name='product-image-list'),
    path('products/<int:pk>/images/<int:image_id>/', api_views.ProductImageDetailView.as_view(), name='product-image-detail'),

    path('categories/', api_views.CategoryListView.as_view(), name='category-list'),
    path('categories/<int:pk>/', api_views.CategoryDetailView.as_view(), name='category-detail'),

    path('orders/', api_views.OrderListView.as_view(), name='order-list'),
    path('orders/<int:pk>/', api_views.OrderDetailView.as_view(), name='order-detail'),

    path('messages/', api_views.MessageListView.as_view(), name='message-list'),
    path('messages/<int:pk>/', api_views.MessageDetailView.as_view(), name='message-detail'),
]
