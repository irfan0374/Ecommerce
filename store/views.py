from django.shortcuts import get_object_or_404, render
from rest_framework.viewsets import ModelViewSet 
from rest_framework.views import APIView
from store.models import Product,Category,Cart,CartItem,Order,Wishlist
from store.serializer import ProductSerializer,AddToCartSerializer,CartItemListSerializer,OrderSerializer,OrderListSerializer,WishlistSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView,ListAPIView
import uuid;




# Create your views here.
class productList(ModelViewSet):
    permission_classes=(AllowAny,)
    # authentication_classes=(JWTAuthentication,)
    queryset=Product.objects.all()
    serializer_class=ProductSerializer

class latestProducts(ModelViewSet):
        permission_classes = (AllowAny,)
    # authentication_classes = (JWTAuthentication,)  # Uncomment if needed
        serializer_class = ProductSerializer

        def get_queryset(self):
        # Return the latest 6 products, ordered by creation date
            return Product.objects.all().order_by('-created_at')[:6]
  
    
class CartItemViewSet(ModelViewSet): 
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    queryset = CartItem.objects.all()  
    serializer_class=AddToCartSerializer
    
    def get_queryset(self):
        user=self.request.user 
        cart=Cart.objects.get(user=user)
        return CartItem.objects.filter(cart=cart)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()  
        serializer = CartItemListSerializer(queryset, many=True, context={'request': request})  
        return Response(serializer.data, status=status.HTTP_200_OK)


    def create(self, request, *args, **kwargs):
      
        if request.user.is_anonymous:
            print("user is not authenticated")
            return Response({"error": "User not authenticated"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Item added to cart"}, status=status.HTTP_201_CREATED)

    
    def update(self, request, *args, **kwargs):
       
        product_id = request.data.get('product_id')
        new_quantity = request.data.get('quantity')

        if not product_id or new_quantity is None:
            return Response({"error": "Product ID and quantity are required."}, status=status.HTTP_400_BAD_REQUEST)

     
        cart_item = self.get_queryset().filter(product_id=product_id).first()

        if not cart_item:
            return Response({"error": "This product is not in the cart."}, status=status.HTTP_404_NOT_FOUND)
       
        serializer = self.get_serializer(cart_item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
     
        cart_item.quantity = new_quantity
        cart_item.save()

        return Response({"message": "Cart item quantity updated successfully"}, status=status.HTTP_200_OK)
       
    def destroy(self, request, *args, **kwargs):
        product_id = request.query_params.get('product_id')

        if not product_id:
            return Response({"error": "Product ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        cart_items_queryset = self.get_queryset()

        cart_item = cart_items_queryset.filter(product_id=product_id).first()

        if not cart_item:
            return Response({"error": "This product is not in the cart."}, status=status.HTTP_404_NOT_FOUND)

        cart_item.delete()

        return Response({"message": "Item removed from the cart"}, status=status.HTTP_204_NO_CONTENT)
    


class OrderViewSet(CreateAPIView):
    serializer_class = OrderSerializer  
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        user = request.user
        print(request.data)
        billing_address = request.data.get('billingAddress')
        payment_method = request.data.get('paymentMethod')
        totalprice = request.data.get('totalAmount')
        product_id = request.data.get('id')
        quantity = request.data.get('quantity')
        product = get_object_or_404(Product, id=product_id)
        invoice_number = str(uuid.uuid4()) 
        # import pdb;pdb.set_trace()
        serializer = OrderSerializer(data={
            'product': product_id,
            'quantity': quantity,
            'address': billing_address, 
            'payment_method': payment_method,
            'total_price': totalprice,
            'invoice_number': invoice_number,  # Include invoice number
            'status': "order-placed",  # Default status
        })

        serializer.is_valid(raise_exception=True)
        order = serializer.save(customer=user, product=product)
        CartItem.objects.filter(product=product,cart__user = user).delete()

        return Response({
            "message": "Order created successfully",
            'order': OrderSerializer(order).data,  # Return single order
        }, status=status.HTTP_201_CREATED)

class OrderListView(ListAPIView):
    serializer_class = OrderListSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
      
        customer = request.user
        orders = Order.objects.filter(customer=customer).select_related('product').order_by('-ordered_date')

      
        serializer = OrderListSerializer(orders, many=True, context={'request': request})

      
        return Response(serializer.data)



class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, customer=request.user)

        if order.status == 'order-cancelled':
            return Response({'detail': 'This order is already canceled.'}, status=status.HTTP_400_BAD_REQUEST)
        elif order.status == 'order-delivered':
            return Response({'detail': 'Delivered orders cannot be canceled.'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = 'canceled'
        order.save()

        return Response({'detail': 'Order has been canceled successfully.'}, status=status.HTTP_200_OK)
    

class wishlistViewSet(ModelViewSet):
    queryset=Wishlist.objects.all()
    serializer_class=WishlistSerializer 
    permission_classes=[IsAuthenticated]   

    def get_queryset(self):
       return Wishlist.objects.filter(user=self.request.user)
    
    def create(self,request,*args, **kwargs):
        # import pdb;pdb.set_trace()
        product_id=request.data.get("id")
      
        product=get_object_or_404(Product,id=product_id)
       
        wishlist,created=Wishlist.objects.get_or_create(user=request.user,product=product)
        
        if not created:
            return Response({"message":"Product is already in wishlist"},status=status.HTTP_400_BAD_REQUEST)
        serializer=self.get_serializer(wishlist)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, *args, **kwargs):

        product_id = kwargs.get('pk')
        product=get_object_or_404(Product,id=product_id)
        wishlist_item = Wishlist.objects.filter(user=request.user, product=product).first()
       
        if wishlist_item:
                wishlist_item.delete()

                return Response({"detail": "Product removed from wishlist."}, status=status.HTTP_204_NO_CONTENT)
        else:
                return Response({"detail": "Product not found in your wishlist."}, status=status.HTTP_404_NOT_FOUND)
            