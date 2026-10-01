from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

from .forms import CheckoutForm
from .models import Order, OrderItem


@login_required
def checkout(request):
    cart = getattr(request.user, "cart", None)
    if not cart or not cart.items.exists():
        messages.info(request, "Votre panier est vide.")
        return redirect("cart:detail")

    if request.method == "POST":
        form = CheckoutForm(request.POST)
        if form.is_valid():
            order = form.save(commit=False)
            order.user = request.user
            order.save()
            for item in cart.items.select_related("product"):
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    product_name=item.product.name,
                    unit_price=item.product.price,
                    quantity=item.quantity,
                )
            cart.items.all().delete()
            return redirect("orders:confirmation", order_id=order.id)
    else:
        initial = {
            "full_name": request.user.get_full_name() or request.user.username,
            "phone": getattr(request.user, "phone", ""),
            "address": getattr(request.user, "address", ""),
        }
        form = CheckoutForm(initial=initial)

    return render(request, "orders/checkout.html", {"form": form, "cart": cart})


@login_required
def confirmation(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    return render(request, "orders/confirmation.html", {"order": order})


@login_required
def order_list(request):
    orders = request.user.orders.prefetch_related("items")
    return render(request, "orders/order_list.html", {"orders": orders})
