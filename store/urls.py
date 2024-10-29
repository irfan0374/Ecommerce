
from django.urls import path,include
from store.views import productList,CartItemViewSet,OrderViewSet,OrderListView,wishlistViewSet,latestProducts,CancelOrderView
# from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('products', productList,basename='product')
router.register('latestProducts', latestProducts,basename='latestProduct')
router.register('cart', CartItemViewSet,basename='cartitem')
router.register('wishlist', wishlistViewSet, basename='wishlist')
 
urlpatterns = [
    path('', include(router.urls)), 
    path('order/create/', OrderViewSet.as_view(), name='order-create'),
    path('order/',OrderListView.as_view(),name='orders-list'),
    path('order/<int:order_id>/cancel/', CancelOrderView.as_view(), name='cancel-order'),
    
]
  