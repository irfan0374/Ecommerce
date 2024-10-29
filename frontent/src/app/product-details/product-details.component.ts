import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  

  constructor(
    private fb:ProductService,
    private activerouter:ActivatedRoute,private route:Router,
    private toastr: ToastrService
 
  ) {}
  quantity: number = 1;

  ngOnInit() {
    const id = Number(this.activerouter.snapshot.paramMap.get('id')); 
    this.fb.userProductDetails(id).subscribe(
      (res) => {
     
        this.product = res;  
      },
      (error: any) => {
        console.log(error.message);  
      }
    );
  }


  addToCart(productId: any) {
    
    this.fb.addToCartService(productId, this.quantity).subscribe((res) => {
      this.toastr.success('Added to cart', '', {
        timeOut: 1000,
      
      });
    }, (error: any) => {
      console.log("Something went wrong", error);
    });
  }

  buyNow(id: number) {
    this.route.navigate(['placeOrder', id], {
      queryParams: { quantity: this.quantity }
    });
  }

  

  }

