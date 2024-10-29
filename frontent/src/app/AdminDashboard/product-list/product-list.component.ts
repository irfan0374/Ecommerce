import { Component, OnInit } from '@angular/core';
import { Product } from './product.model';
import { ProductService } from 'src/app/service/product.service';
import { lastValueFrom } from 'rxjs'; // Import this to convert observable to promise

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products:any;

  constructor(private fb: ProductService) { }

  ngOnInit(): void {

    lastValueFrom(this.fb.ProductList())
      .then(res => {
        console.log(res);
        this.products = res;  
      })
      .catch(err => {
        console.log(err.message);  
      });
  }

}
