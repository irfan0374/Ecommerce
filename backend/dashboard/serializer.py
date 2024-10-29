from rest_framework import serializers
from django.contrib.auth.models import User
from store.models import Product,Category,Order


class ProductSerializer(serializers.ModelSerializer):
    
    class Meta:
        model=Product
        fields=["title","description","price","category",'image']

    def validate_price(self,value):
        if value <=1: 
            
            raise serializers.ValidationError('price must be greaterthat 1')
        return value
    def validate(self ,data):
        if len(data['title'])<4:
            raise serializers.ValidationError('Product title must be at least 3 characters long')
        return data
    
    def validate_category(self, value):    
        if isinstance(value, int):  
            category = Category.objects.filter(id=value)
            if not category:
                raise serializers.ValidationError("Invalid category. Please select a valid category.") 
        return value
     
    def create(self, validated_data):
       
        product = Product.objects.create(**validated_data)
        return product        


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model=Category
        fields=['id','title']


class UserListSerializer(serializers.ModelSerializer):

    class Meta:
        model=User
        fields="__all__"

class ProductListSerializer(serializers.ModelSerializer): 
    vegitable_category_name = serializers.CharField(source='category.title')

    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'image', 'created_at', 'vegitable_category_name']  


class OrderListSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  

    class Meta:
        model = Order
        fields = [
            "id",
            "product",
            "status", 
            "ordered_date",
            "address",
            "invoice_number",
            "total_price",
            "quantity",
            "payment_method",
        ]
        read_only_fields = ["id", "product", "ordered_date", "invoice_number", "total_price", "quantity", "payment_method"]  
 