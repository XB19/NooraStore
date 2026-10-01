from django.contrib import messages
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views.decorators.http import require_POST
from django.views.generic import TemplateView

from catalog.models import Category, Favorite, Product

from .forms import ContactForm


def _home_context(request):
    context = {}

    context["top_categories"] = Category.objects.filter(parent__isnull=True)
    vetements = Category.objects.filter(slug="vetements").first()
    context["vetements_subcategories"] = vetements.children.all() if vetements else []

    products = (
        Product.objects.filter(is_active=True, is_featured=True)
        .select_related("category")
        .prefetch_related("images")
    )
    if not products.exists():
        products = (
            Product.objects.filter(is_active=True)
            .select_related("category")
            .prefetch_related("images")
            .order_by("-created_at")
        )
    context["featured_products"] = products[:6]

    user = request.user
    if user.is_authenticated:
        context["favorite_ids"] = set(Favorite.objects.filter(user=user).values_list("product_id", flat=True))
    else:
        context["favorite_ids"] = set()

    context["contact_form"] = ContactForm()
    return context


class HomeView(TemplateView):
    template_name = "storefront/home.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(_home_context(self.request))
        return context


@require_POST
def contact_submit(request):
    form = ContactForm(request.POST)
    if form.is_valid():
        form.save()
        messages.success(request, "Merci ! Votre message a bien été envoyé, nous vous répondrons rapidement.")
        return redirect(f"{reverse('storefront:home')}#contact")

    messages.error(request, "Merci de corriger les champs signalés ci-dessous.")
    context = _home_context(request)
    context["contact_form"] = form
    return render(request, "storefront/home.html", context)
