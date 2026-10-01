from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand

from catalog.models import Category, Product, ProductImage

SEED_DIR = Path(__file__).resolve().parent.parent.parent / "seed_images"


def _file(name):
    return File(open(SEED_DIR / f"{name}.jpg", "rb"), name=f"{name}.jpg")


CATEGORIES = [
    {"slug": "tissus", "name": "Tissus", "image": "rouleaux-tissus"},
    {"slug": "vetements", "name": "Vêtements", "image": "robe-wax-femme"},
    {"slug": "accessoires", "name": "Accessoires", "image": "sac-kente"},
]

SUBCATEGORIES = [
    {"slug": "vetements-homme", "name": "Homme", "parent": "vetements", "image": "ensemble-brode-homme"},
    {"slug": "vetements-femme", "name": "Femme", "parent": "vetements", "image": "femmes-ceremonie"},
    {"slug": "vetements-enfants", "name": "Enfants", "parent": "vetements", "image": "enfants-duo"},
]

# Prix alignés sur des ordres de grandeur réels du marché togolais (boutiques de
# Lomé / Grand Marché) : le wax local "fancy" est le moins cher au mètre, suivi
# du wax premium, puis du wax hollandais authentique, du bazin riche, du batik
# fait main et enfin du kenté tissé main — le plus coûteux car entièrement
# artisanal. Longueur = conversion des yards habituels (1 yard ≈ 0,91 m).
PRODUCTS = [
    {
        "slug": "wax-hollandais-6-yards", "name": "Wax hollandais 6 yards", "category": "tissus",
        "price": 28000, "old_price": 35000, "length_m": "5.50", "badge": "Promo", "featured": True,
        "description": "Wax hollandais authentique, coupe de 6 yards (≈5,5 m), coloris vifs et tenue impeccable au lavage.",
        "images": ["wax-hollandais", "wax-premium"],
    },
    {
        "slug": "pagne-wax-fancy-imprime", "name": "Pagne wax fancy imprimé", "category": "tissus",
        "price": 6500, "old_price": None, "length_m": "5.50", "badge": "", "featured": False,
        "description": "Wax fancy imprimé, l'option accessible pour un usage quotidien, coupe de 6 yards (≈5,5 m).",
        "images": ["wax-premium", "pagne-batik"],
    },
    {
        "slug": "wax-premium-6-yards", "name": "Wax Premium 6 yards", "category": "tissus",
        "price": 16000, "old_price": None, "length_m": "5.50", "badge": "", "featured": False,
        "description": "Notre wax premium, tissage serré et couleurs éclatantes, coupe de 6 yards (≈5,5 m).",
        "images": ["wax-premium", "wax-hollandais"],
    },
    {
        "slug": "bazin-riche-brode", "name": "Bazin riche brodé", "category": "tissus",
        "price": 34000, "old_price": None, "length_m": "9.10", "badge": "Nouveau", "featured": False,
        "description": "Bazin riche brodé main, coupon de 10 yards (≈9,1 m), tissu damassé haut de gamme pour grand boubou.",
        "images": ["rouleaux-tissus", "wax-hollandais"],
    },
    {
        "slug": "pagne-batik-teint-main", "name": "Pagne batik teint main", "category": "tissus",
        "price": 12000, "old_price": None, "length_m": "1.80", "badge": "", "featured": True,
        "description": "Pagne batik indigo teint à la main, motifs uniques, pièce de 2 yards (≈1,8 m), idéal pour une tenue de cérémonie.",
        "images": ["pagne-batik", "rouleaux-tissus"],
    },
    {
        "slug": "rouleau-kente-tisse-main", "name": "Rouleau kenté tissé main", "category": "tissus",
        "price": 65000, "old_price": None, "length_m": "7.30", "badge": "Nouveau", "featured": False,
        "description": "Rouleau de kenté tissé à la main selon la tradition, pièce de 8 yards (≈7,3 m), pièce d'exception pour vos grandes occasions.",
        "images": ["rouleaux-tissus", "pagne-batik"],
    },
    {
        "slug": "ensemble-brode", "name": "Ensemble brodé", "category": "vetements-homme",
        "price": 28500, "old_price": None, "badge": "", "featured": True,
        "description": "Ensemble homme brodé main, coupe ajustée, parfait pour les grandes cérémonies.",
        "images": ["ensemble-brode-homme", "homme-imprime"],
    },
    {
        "slug": "chemise-imprimee-wax", "name": "Chemise imprimée wax", "category": "vetements-homme",
        "price": 15000, "old_price": None, "badge": "", "featured": False,
        "description": "Chemise homme en wax imprimé, coupe droite, idéale pour le bureau ou le week-end.",
        "images": ["homme-imprime", "ensemble-brode-homme"],
    },
    {
        "slug": "grand-boubou-brode", "name": "Grand boubou brodé", "category": "vetements-homme",
        "price": 38000, "old_price": None, "badge": "Nouveau", "featured": False,
        "description": "Grand boubou trois pièces en bazin riche, broderie fine main, tenue de cérémonie par excellence.",
        "images": ["ensemble-brode-homme", "homme-imprime"],
    },
    {
        "slug": "costume-trois-pieces-wax",
        "name": "Costume trois pièces wax",
        "category": "vetements-homme",
        "price": 45000, "old_price": None, "badge": "", "featured": False,
        "description": "Costume trois pièces confectionné en wax, coupe moderne pour bureau et cérémonies.",
        "images": ["homme-imprime", "ensemble-brode-homme"],
    },
    {
        "slug": "robe-wax-sur-mesure", "name": "Robe wax sur-mesure", "category": "vetements-femme",
        "price": 22000, "old_price": None, "badge": "", "featured": True,
        "description": "Robe wax confectionnée sur-mesure par notre atelier, selon vos mensurations.",
        "images": ["robe-wax-femme", "femme-portrait"],
    },
    {
        "slug": "ensemble-deux-pieces-ceremonie", "name": "Ensemble deux pièces cérémonie", "category": "vetements-femme",
        "price": 26000, "old_price": None, "badge": "Nouveau", "featured": False,
        "description": "Ensemble deux pièces pour vos cérémonies, tissu wax haut de gamme.",
        "images": ["femmes-ceremonie", "robe-wax-femme"],
    },
    {
        "slug": "tenue-tradi-couture", "name": "Tenue tradi-couture", "category": "vetements-femme",
        "price": 24000, "old_price": None, "badge": "", "featured": False,
        "description": "Tenue tradi-couture confectionnée par nos artisans, coupe moderne et tissu traditionnel.",
        "images": ["femme-portrait", "femmes-ceremonie"],
    },
    {
        "slug": "ensemble-wax-enfant", "name": "Ensemble wax enfant", "category": "vetements-enfants",
        "price": 7500, "old_price": None, "badge": "", "featured": True,
        "description": "Ensemble wax pour enfant, confortable et coloré, disponible en plusieurs tailles.",
        "images": ["ensemble-enfant", "enfants-duo"],
    },
    {
        "slug": "robe-fillette-ceremonie", "name": "Robe fillette cérémonie", "category": "vetements-enfants",
        "price": 8500, "old_price": None, "badge": "", "featured": False,
        "description": "Robe fillette pour les grandes occasions, tissu wax doux et coupe confortable.",
        "images": ["enfants-duo", "ensemble-enfant"],
    },
    {
        "slug": "sac-a-main-kente", "name": "Sac à main kenté", "category": "accessoires",
        "price": 9000, "old_price": None, "badge": "Nouveau", "featured": True,
        "description": "Sac à main en tissu kenté, doublure intérieure et fermeture zip.",
        "images": ["sac-kente", "rouleaux-tissus"],
    },
    {
        "slug": "foulard-imprime-wax", "name": "Foulard imprimé wax", "category": "accessoires",
        "price": 4500, "old_price": None, "badge": "", "featured": False,
        "description": "Foulard imprimé wax, léger et polyvalent, à porter en toute saison.",
        "images": ["rouleaux-tissus", "sac-kente"],
    },
]


class Command(BaseCommand):
    help = "Crée ou met à jour les catégories et produits de démonstration Noora Store."

    def handle(self, *args, **options):
        categories = {}

        for data in CATEGORIES:
            category, _ = Category.objects.get_or_create(slug=data["slug"], defaults={"name": data["name"]})
            if not category.image:
                category.image.save(f"{data['image']}.jpg", _file(data["image"]), save=True)
            categories[data["slug"]] = category
            self.stdout.write(self.style.SUCCESS(f"Catégorie : {category.name}"))

        for data in SUBCATEGORIES:
            category, _ = Category.objects.get_or_create(
                slug=data["slug"],
                defaults={"name": data["name"], "parent": categories[data["parent"]]},
            )
            if not category.image:
                category.image.save(f"{data['image']}.jpg", _file(data["image"]), save=True)
            categories[data["slug"]] = category
            self.stdout.write(self.style.SUCCESS(f"Sous-catégorie : {category.name}"))

        for data in PRODUCTS:
            product, created = Product.objects.update_or_create(
                slug=data["slug"],
                defaults={
                    "name": data["name"],
                    "category": categories[data["category"]],
                    "description": data["description"],
                    "price": data["price"],
                    "old_price": data["old_price"],
                    "length_m": data.get("length_m"),
                    "badge": data["badge"],
                    "is_featured": data["featured"],
                },
            )
            if created:
                for order, img_name in enumerate(data["images"]):
                    image = ProductImage(product=product, order=order, alt_text=product.name)
                    image.image.save(f"{img_name}.jpg", _file(img_name), save=True)
                self.stdout.write(self.style.SUCCESS(f"Produit créé : {product.name}"))
            else:
                self.stdout.write(f"Produit mis à jour : {product.name}")

        self.stdout.write(self.style.SUCCESS("Seed terminé."))
