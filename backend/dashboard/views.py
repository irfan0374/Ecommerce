from django.shortcuts import render
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.generics import CreateAPIView,ListCreateAPIView,RetrieveUpdateAPIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated,AllowAny
from dashboard.serializer import ProductSerializer,CategorySerializer,UserListSerializer,ProductListSerializer,OrderListSerializer
from store.models import Product,Category,Order
from rest_framework.response import Response 
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from django.shortcuts import get_object_or_404, render
# Create your views here.

class add_product(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request, *args, **kwargs):
        print(request.data, "request .data")
        serializer = ProductSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                product = serializer.save()  
                response_data = ProductSerializer(product).data 
                return Response({
                    "product": response_data,  
                    "message": "Product created successfully"
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f"Error occurred: {e}") 
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class categories(ListCreateAPIView): 
    # authentication_classes=(JWTAuthentication,)
    permission_classes=(AllowAny,)
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
class user_List(ListCreateAPIView): 
    authentication_classes=(JWTAuthentication,)
    permission_classes=(AllowAny,)
    queryset=User.objects.all()
    serializer_class=UserListSerializer
 
class product_list(ListCreateAPIView):
    authentication_classes=(JWTAuthentication,)
    permission_classes=(AllowAny,)
    queryset=Product.objects.all()
    serializer_class=ProductListSerializer

class ToggleuserStatus(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (AllowAny,)

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.is_active = not user.is_active
            user.save()

            return Response({
                'status': 'success',
                'message': f'User status updated to {"active" if user.is_active else "inactive"}',
                'is_active': user.is_active
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({
                'status': 'error',
                'message': "User not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
class OrderViewSet(ModelViewSet):
    serializer_class = OrderListSerializer
    permission_classes = [IsAuthenticated]  

    def get_queryset(self):
        user = self.request.user
        
        if user.is_staff:
            return Order.objects.all()

        return Order.objects.filter(customer=user)

    def update(self, request, *args, **kwargs):
        order_id = kwargs.get('pk')
        order = get_object_or_404(Order, id=order_id)

       
        if request.user != order.customer and not request.user.is_staff:
            return Response({"detail": "You do not have permission to update this order."}, status=status.HTTP_403_FORBIDDEN)

        
        new_status = request.data.get('status')
        if new_status:
            order.status = new_status
            order.save()
            return Response({"message": "Order status updated successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Status not provided."}, status=status.HTTP_400_BAD_REQUEST)