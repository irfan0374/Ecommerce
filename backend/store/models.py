from django.db import models
import datetime
from django.contrib.auth.models import User
from imagekit.models import ImageSpecField
from django_resized import ResizedImageField
from imagekit.processors import ResizeToFill

# Category model
class Category(models.Model):
    title = models.CharField(max_length=50)

    def __str__(self):
        return self.title

# Product model
class Product(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.ForeignKey('store.Category', on_delete=models.CASCADE)
    image = ResizedImageField(size=[800, 800], upload_to='product_images/')
    created_at = models.DateTimeField(auto_now_add=True)
    image_thumbnail = ImageSpecField(source='image',
                                     processors=[ResizeToFill(200, 200)],
                                     format='JPEG',
                                     options={'quality': 60})

    def __str__(self):
        return self.title

# Order model
class Order(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    invoice_number = models.CharField(max_length=50)
    STATUS_CHOICES = (
        ("order-placed", "Order Placed"),
        ("on-transit", "On Transit"),
        ("order-cancelled", "Order Cancelled"),
        ("order-delivered", "Order Delivered"),
    )
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="order-placed")
    address = models.TextField(max_length=200)
    ordered_date = models.DateTimeField(auto_now_add=True) 
    PAYMENT_OPTIONS = (
        ("paypal", "PayPal"),
        ("cod", "Cash on Delivery"),
        ("Upi", "Bank Transfer"),
    )
    payment_method = models.CharField(max_length=50, choices=PAYMENT_OPTIONS, default="cod")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.title} - {self.invoice_number}"

# Cart model
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Cart"

# CartItem model
class CartItem(models.Model):
    cart = models.ForeignKey('store.Cart', on_delete=models.CASCADE, null=True, blank=True, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.quantity} of {self.product.title}'

# Wishlist model
class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wishlist")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="wishlisted")
    added_at = models.DateTimeField(auto_now_add=True)
