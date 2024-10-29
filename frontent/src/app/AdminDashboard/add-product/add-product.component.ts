import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../service/product.service';
import { Product } from '../product-list/product.model';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  // Use a consistent name for the form
  addProduct!: FormGroup;
  category: any;
  file!: File;
  productDetails: any

  constructor(private fb: ProductService ,   private toastr: ToastrService ) { }

  ngOnInit(): void {

    this.fb.CategoryService().subscribe((res => this.category = res), (error: any) => {
      console.log(error.message)
    })


    // Initialize the form
    this.addProduct = new FormGroup({
      'title': new FormControl('', Validators.required),
      'price': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
      'category': new FormControl('', Validators.required)
    });
  }

  // Handle file input
  onChange(event: any) {
    this.file = event.target.files[0];
  }
  addProductFunction() {
   

    this.fb.AddProduct(this.addProduct.value, this.file)
      .then(res => res.json())
      .then(data => {
        this.toastr.success('Product Added succesfully');

        this.productDetails = data

        this.addProduct.reset();
      })
      .catch(error => {
        console.error("Error adding product", error);
      });
  }

}
