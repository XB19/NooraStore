from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render

from orders.models import STATUS_CHOICES, Order

from ..decorators import staff_required
from ..forms import OrderStatusForm
from ..utils import sidebar_context


@staff_required
def order_list(request):
    orders = Order.objects.select_related("user").prefetch_related("items")

    status = request.GET.get("statut", "")
    if status:
        orders = orders.filter(status=status)

    context = {
        **sidebar_context("orders"),
        "orders": orders,
        "status_choices": STATUS_CHOICES,
        "current_status": status,
    }
    return render(request, "admin_panel/orders/list.html", context)


@staff_required
def order_detail(request, pk):
    order = get_object_or_404(Order.objects.prefetch_related("items"), pk=pk)

    if request.method == "POST":
        form = OrderStatusForm(request.POST, instance=order)
        if form.is_valid():
            form.save()
            messages.success(request, f"Statut de la commande #{order.id} mis à jour.")
            next_url = request.POST.get("next")
            if next_url and next_url.startswith("/"):
                return redirect(next_url)
            return redirect("admin_panel:order-detail", pk=order.pk)
    else:
        form = OrderStatusForm(instance=order)

    context = {
        **sidebar_context("orders"),
        "order": order,
        "form": form,
    }
    return render(request, "admin_panel/orders/detail.html", context)
