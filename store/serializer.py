from rest_framework import serializers
from store.models import Product,CartItem,Cart,Order,Wishlist

class ProductSerializer(serializers.ModelSerializer):
    category_name=serializers.CharField(source="category.title")
    image = serializers.SerializerMethodField()
    class Meta:
        model=Product
        fields=['id','title','price','image','description','created_at','category_name',]
    
    def get_image(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        print(obj.image.url)
        return obj.image.url
    
class CartItemListSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)  
    class Meta:
        model = CartItem
        fields = [
            'cart',
            'product',
            'quantity',
            'added_at',
        ]
        

class AddToCartSerializer(serializers.ModelSerializer):

    product_id=serializers.IntegerField(write_only=True)

    class Meta:
        model=CartItem
        fields = ['product_id', 'quantity'] 

    def validate(self, data):
      
        try:
            product = Product.objects.get(id=data['product_id'])
            data['product'] = product  
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product does not exist.")
        return data
    
    def create(self, validated_data):
        product = validated_data.pop('product') 
        cart, created = Cart.objects.get_or_create(user=self.context['request'].user)
       
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
   
        if not created:
            cart_item.quantity += validated_data['quantity'] 
            cart_item.save()
        return cart_item

class OrderSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), write_only=True)
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES, read_only=True)
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_OPTIONS)
    total_price = serializers.IntegerField()


    class Meta:
        model = Order
        # imort 
        fields = [
            "id",
            "product",
            "quantity",
            "total_price",
            "status",
            "ordered_date",
            "address",
            "payment_method",
        ]
        extra_kwargs = {
            "address": {"required": True},
            "payment_method": {"required": True},
            "quantity": {"required": True},
            "total_price": {"read_only": True},
        }

class OrderListSerializer(serializers.ModelSerializer):
    product=serializers.CharField(read_only=True)
    status=serializers.CharField(read_only=True)
    payment_method=serializers.CharField(read_only=True)
    product=ProductSerializer()
    

    class Meta:
        model=Order
        fields=[
            "id",
            "product",
            "status",
            "ordered_date",
            
            "address",
            "invoice_number",
            "total_price",
            "quantity",
            "payment_method"
        ]
    

class WishlistSerializer(serializers.ModelSerializer):
    product=ProductSerializer()
    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'added_at']
        read_only_fields = ['id', 'user', 'added_at']