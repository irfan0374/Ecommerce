from django.contrib import admin
from .models import Product

# class ProductAdmin(admin.ModelAdmin):
#     list_display = ('title', 'price', 'category', 'created_at')  # Fields to display in the list view

admin.site.register(Product)