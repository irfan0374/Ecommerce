import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProductComponent } from './product/product.component';
import { AddProductComponent } from './AdminDashboard/add-product/add-product.component';
import { AddCategoryComponent } from './AdminDashboard/add-category/add-category.component';
import { ProductListComponent } from './AdminDashboard/product-list/product-list.component';
import { UserListComponent } from './AdminDashboard/user-list/user-list.component';
import { SidebarComponent } from './AdminDashboard/sidebar/sidebar.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { OrderComponent } from './order/order.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { OrderListComponent } from './AdminDashboard/order-list/order-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // Default route to login
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'product', component: ProductComponent },
  { path: 'admin/addProduct', component: AddProductComponent },
  { path: 'admin/addCategory', component: AddCategoryComponent },
  { path: 'admin/productList', component: ProductListComponent },
  { path: 'admin/userlist', component: UserListComponent },
  { path: 'product_details/:id', component: ProductDetailsComponent },
  { path: 'shoppingCart', component: ShoppingCartComponent },
  { path: 'placeOrder/:id', component: PlaceOrderComponent },
  { path: 'myOrder', component: OrderComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'admin/order-list', component: OrderListComponent },

  // { path: 'error', component: ErrorComponent }, // Route to error page component
  // { path: '**', redirectTo: 'login' } // Wildcard route for undefined paths
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
