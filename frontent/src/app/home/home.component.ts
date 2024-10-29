import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; 
import Swal from 'sweetalert2';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {
  email: string = '';
  products: any[] = []; // Make sure to initialize products
 

  constructor(private productApi: ProductService,private router:Router,private toastr: ToastrService ) { }

  ngOnInit(): void {
    this.loadProducts(); // Call method to load products
  }

  loadProducts() {
    // Fetch products from your service
    this.productApi.latestProduct().subscribe((data: any) => {
      console.log(data, "latest produt")
      this.products = data;
    });
  }
  addToCart(productId: number, quantity: number) {
 
    this.productApi.addToCartService(productId, quantity).subscribe((res) => {
      Swal.fire({
        title: 'Success!',
        text: 'Your item has been added to the cart.',
        icon: 'success',
        confirmButtonText: 'Okay'
      });
      
    }
     
    , (error: any) => {
      Swal.fire({
        title: 'Error!',
        text: "something went wrong",
        icon: 'error',
        confirmButtonText: 'Retry'
      });
    })
  }

  detailPage(id:any){
    this.router.navigate(['product_details', id]); 
  }

  navigate(){
    this.router.navigate(['product'])
  }


}

