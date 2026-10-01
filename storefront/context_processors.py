def header_counts(request):
    user = getattr(request, "user", None)
    if not user or not user.is_authenticated:
        return {"header_cart_count": 0, "header_favorites_count": 0}

    cart = getattr(user, "cart", None)
    return {
        "header_cart_count": cart.item_count if cart else 0,
        "header_favorites_count": user.favorites.count(),
    }
