import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { Product } from '../AdminDashboard/product-list/product.model';
import { CartItem } from '../shopping-cart/cart.model';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  reset() {
    throw new Error('Method not implemented.');
  }
  private producturl = 'http://192.168.1.134:8000/api/products/';
  private cartUrl = 'http://192.168.1.134:8000/api/cart/';
  private orderUrl= 'http://192.168.1.134:8000/api/order/';
  private adminApi = 'http://192.168.1.134:8000/dashboard/';
  private wishlistApi = 'http://192.168.1.134:8000/api/wishlist/';
  private latestProducts = 'http://192.168.1.134:8000/api/latestProducts/';

  constructor(private http: HttpClient) { }


  fetchToken() {
    return localStorage.getItem('token')
  }


  getAllOrders():Observable<any>{
    let headers=new HttpHeaders()
    let token=this.fetchToken()
    if(token){
      headers=headers.append("Authorization",`Bearer ${token}`)
    }
    return this.http.get(`${this.adminApi}orders/`,{headers})
  }

  updateOrderStatus(orderId: any, newStatus: string): Observable<any> {
    let headers = new HttpHeaders();
    let token = this.fetchToken();
    if (token) {
        headers = headers.append("Authorization", `Bearer ${token}`);
    }
    // Pass the status in the request body
    return this.http.put(`${this.adminApi}orders/${orderId}/`, { status: newStatus }, { headers });
}


  


  AddProduct(data: any, file: any) {

    var formdata = new FormData()
    for (const key of Object.keys(data)) {
      var value = data[key]
      formdata.append(key, value)
    }

    if (file) {
      formdata.append('image', file, file.name);
  }

    formdata.append('image', file, file.name)
    let header = new Headers
    let token = this.fetchToken()
    // if (token) {
    //   header.append('Authorization', `Bearer ${token}`);
    // }

    let options = {
      method: 'POST',
      headers: header,
      body: formdata
    }
    return fetch(`http://192.168.1.134:8000/dashboard/add_product/`, options)

  }
  ProductList(): Observable<Product[]> {
    let headers = new HttpHeaders
    let token = this.fetchToken()
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    return this.http.get<Product[]>(`${this.adminApi}list_product/`, { headers });
  }
  
  productListInUser(): Observable<Product[]> {
    let headers = new HttpHeaders
    let token = this.fetchToken()
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    return this.http.get<Product[]>(`${this.producturl}`,{ headers });

  }
  latestProduct(): Observable<Product[]> {
    let headers = new HttpHeaders
    let token = this.fetchToken()
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    return this.http.get<Product[]>(`${this.latestProducts}`,{ headers });

  }
  userProductDetails(id: number): Observable<Product> {  
    let headers = new HttpHeaders();
    const token = this.fetchToken();
    if (token) {
     headers= headers.append('Authorization', `Bearer ${token}`); 
    }
    return this.http.get<Product>(`${this.producturl}${id}/`, { headers });  
  }

  updateTheCart(cartId:any,productId:any,count:number): Observable<any> {
    let headers=new HttpHeaders()
    const token=this.fetchToken()
    if(token){
      headers=headers.append('Authorization', `Bearer ${token}`); 
    }
  
    return this.http.put<any>(`${this.cartUrl}${cartId}/`, { product_id: productId, quantity: count }, { headers });
  }
  deleteCartItem(cartId:number,productId:number):Observable<any>{
    let headers=new HttpHeaders()
    const token=this.fetchToken()
    if(token){
      headers=headers.append('Authorization', `Bearer ${token}`); 
    }

    return this.http.delete<any>(`${this.cartUrl}${cartId}/?product_id=${productId}`,{headers});
  }

  addToCartService(id: any, count: number): Observable<any> {
   
    let headers = new HttpHeaders();
    const token = this.fetchToken();
    if (token) {
        headers=headers.append('Authorization', `Bearer ${token}`);
    }else{
      alert("token is expired ")
    }
  
    return this.http.post(`${this.cartUrl}`, { product_id: id, quantity: count }, { headers });
}

CategoryService() {
  let headers = new HttpHeaders(); 
  let token = this.fetchToken();

  if (token) {
      headers = headers.append('Authorization', `Bearer ${token}`);
  }
    headers.append('Content-Type', 'application/json')

    let options = {
      method: 'GET',
      headers: headers
    };
    
    return this.http.get(`http://192.168.1.134:8000/dashboard/categories/`, options);
  }
    // fetch the categories in admin side
  addCategoryService(data: any) {
 
    return this.http.post(`${this.adminApi}categories/`,data)
  }

  UserList(): Observable<any> {
    const headers = new HttpHeaders
    const token = this.fetchToken()
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    return this.http.get(`${this.adminApi}list_User/`, { headers })
  }

  toggleUserStatus(userId: number): Observable<any> {
    return this.http.post(`${this.adminApi}status_user/${userId}/`, {});
  }

  // fetcht the cart items

  cartListService():Observable<any>{
    let headers=new HttpHeaders()
    let token=this.fetchToken()
    if(token){
      headers=headers.append("Authorization",`Bearer ${token}`)
    }
    return this.http.get(`${this.cartUrl}`,{headers})
  }

  
  buyNow(productId:number,quantity:number):Observable<any>{
    let headers=new HttpHeaders()
    let token=this.fetchToken()
    if(token){
      headers=headers.append("Authorization",`Bearer ${token}`)
    }
    return this.http.post(`${this.orderUrl}create/`,{ product_id: productId, quantity: quantity },{headers})
  }

  placeOrderService(orderData:any):Observable<any>{
    let headers=new HttpHeaders()
    let token=this.fetchToken()
    if(token){
      headers=headers.append("Authorization",`Bearer ${token}`)
    }
    return this.http.post(`${this.orderUrl}create/`,orderData,{headers})

  }


  listOrderService():Observable<any>{
    let headers=new HttpHeaders()
    let token=this.fetchToken()
    if(token){
      headers=headers.append("Authorization",`Bearer ${token}`)
    }
    return this.http.get(`${this.orderUrl}`,{headers})
  }


  wishlistService():Observable<any>{
    let headers=new HttpHeaders()
    let token=this.fetchToken()
    if(token){
      headers=headers.append("Authorization",`Bearer ${token}`)
    }
    return this.http.get(`${this.wishlistApi}`,{headers})
  }


  removeFromwishlist(id:number):Observable<any>{

    
    let headers=new HttpHeaders()
    let token =this.fetchToken()
    if(token){
      headers=headers.append("Authorization",`Bearer ${token}`)
    }
    return this.http.delete(`${this.wishlistApi}${id}/`,{headers})
  }

    
  addToWishlist(ProductId:number):Observable<any>{
    let headers=new HttpHeaders()
    let token=this.fetchToken()
    if(token){
      headers=headers.append("Authorization",`Bearer ${token}`)
    }
    return this.http.post(`${this.wishlistApi}`,{id:ProductId},{headers})
  }


  cancelOrder(orderId: number): Observable<any> {
    const token = this.fetchToken();
    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.orderUrl}${orderId}/cancel/`, {}, { headers });
}



}


