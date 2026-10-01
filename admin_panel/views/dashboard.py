from django.shortcuts import render

from catalog.models import Product
from orders.models import Order
from storefront.models import ContactMessage

from ..decorators import staff_required
from ..utils import sidebar_context


@staff_required
def dashboard(request):
    orders = Order.objects.exclude(status="annulee").prefetch_related("items")
    revenue = sum(o.total for o in orders)

    context = {
        **sidebar_context("dashboard"),
        "total_orders": Order.objects.count(),
        "pending_orders": Order.objects.filter(status="en_attente").count(),
        "revenue": revenue,
        "active_products": Product.objects.filter(is_active=True).count(),
        "unread_messages": ContactMessage.objects.filter(is_read=False).count(),
        "recent_orders": Order.objects.select_related("user").prefetch_related("items")[:5],
        "recent_messages": ContactMessage.objects.all()[:5],
    }
    return render(request, "admin_panel/dashboard.html", context)
