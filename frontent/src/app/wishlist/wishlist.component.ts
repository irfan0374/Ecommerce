import { Component, OnInit } from '@angular/core';
import { Product } from '../shopping-cart/cart.model';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  quantity:any=1

  wishlistItems: any = [];
  constructor(private productApi:ProductService){

  }

  ngOnInit() {
   this.wishList()
  }


  wishList(){
    this.productApi.wishlistService().subscribe((res)=>{
      console.log(res)
      this.wishlistItems=res
    },(error:any)=>{
      console.log("list wishlist error",error.message)
    })

  }

  addToCart(id: number) {
    this.productApi.addToCartService(id,this.quantity).subscribe((res)=>{
      this.removeFromWishlist(id)
    })
  }

  removeFromWishlist(product_id: number) {
  this.productApi.removeFromwishlist(product_id).subscribe((res)=>{
    this.wishList()
  },(error:any)=>{
    console.log("remove cart error",error.message)
  })
}


}
