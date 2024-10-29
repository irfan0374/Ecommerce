from django.urls import path, include
from dashboard.views import add_product, categories, user_List, product_list, ToggleuserStatus, OrderViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('orders', OrderViewSet, basename='order')

urlpatterns = [
    path('add_product/', add_product.as_view(), name="addProduct"),
    path('categories/', categories.as_view(), name="categories"),
    path('list_User/', user_List.as_view(), name="UserList"),
    path('list_product/', product_list.as_view(), name="ProductList"),
    path('status_user/<int:user_id>/', ToggleuserStatus.as_view(), name='toggle_status'),
    
    # Include the router URLs for orders
    path('', include(router.urls)),
]
