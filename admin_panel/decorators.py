from django.contrib.auth.decorators import user_passes_test

# staff_member_required de Django redirige par défaut vers /admin/login/ (page
# Django générique). On utilise notre propre décorateur pour rediriger vers
# accounts:login (settings.LOGIN_URL) et garder le même design partout.
staff_required = user_passes_test(lambda u: u.is_active and u.is_staff)
