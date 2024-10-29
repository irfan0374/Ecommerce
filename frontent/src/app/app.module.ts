import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './product/product.component';
import { AddProductComponent } from './AdminDashboard/add-product/add-product.component';
import { DashboardComponent } from './AdminDashboard/dashboard/dashboard.component';
import { AddCategoryComponent } from './AdminDashboard/add-category/add-category.component';
import { ProductListComponent } from './AdminDashboard/product-list/product-list.component';
import { UserListComponent } from './AdminDashboard/user-list/user-list.component';
import { SidebarComponent } from './AdminDashboard/sidebar/sidebar.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { OrderComponent } from './order/order.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WishlistComponent } from './wishlist/wishlist.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


// PrimeNG modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CarouselModule } from 'primeng/carousel';
import { OrderListComponent } from './AdminDashboard/order-list/order-list.component';
import { ErrorPageComponent } from './error-page/error-page.component';

// PrimeIcons CSS
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [

    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    ProductComponent,
    AddProductComponent,
    DashboardComponent,
    AddCategoryComponent, 
    ProductListComponent,
    UserListComponent,
    SidebarComponent,
    ProductDetailsComponent,
    ShoppingCartComponent,
    PlaceOrderComponent,
    OrderComponent,
    WishlistComponent,
    OrderListComponent,
    ErrorPageComponent
  ],
  imports: [

    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    ToastModule,
    CarouselModule,
    SweetAlert2Module.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot() ,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule ,
    RouterModule,
    HttpClientModule,
    RouterModule,
    NgbModule,
    RouterModule.forRoot([]),
    ToastrModule.forRoot({
     
      timeOut: 1000,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
