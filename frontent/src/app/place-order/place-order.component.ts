import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../service/product.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
  product: any;
  totalAmount: number = 0;
  id: any;
  quantity: any;
  orderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productapi: ProductService,
    private router: Router,
    private activerouter: ActivatedRoute
  ) {
   
    const navigation = this.router.getCurrentNavigation();
    

    // Initializing the form with validators
    this.orderForm = this.fb.group({
      billingAddress: ['', Validators.required],
      paymentMethod: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.activerouter.paramMap.subscribe((params: ParamMap) => {
        this.id = +params.get('id')!;
    });

    this.activerouter.queryParamMap.subscribe((params: ParamMap) => {
        this.quantity = +params.get('quantity')!; 
    });

    // Load product details and calculate total after data is retrieved
    this.productapi.userProductDetails(this.id).subscribe(
        (res) => {
            this.product = res;
            // Only call calculateTotal here, ensuring product is loaded
            this.calculateTotal(this.product?.price, this.quantity);
        },
        (error: any) => {
            console.log(error.message);  
        }
    );
}

calculateTotal(price: number, quantity: number): void {
    // Check if both price and quantity are valid numbers
    if (!isNaN(price) && !isNaN(quantity)) {
        this.totalAmount = quantity * price;
    } else {
        this.totalAmount = 0; 
        console.log("Invalid price or quantity:", price, quantity);
    }

}


placeOrder(): void {
  if (this.orderForm.valid) {
    const orderData = {
      ...this.orderForm.value,
      id: this.product.id,
      totalAmount: this.totalAmount,
      quantity: this.quantity
    };

    this.productapi.placeOrderService(orderData).subscribe((res) => {
      console.log("Product added successfully", res);
      this.router.navigate(['myOrder']);
    }, (error) => {
      console.log("Something went wrong", error);  
    });
    
  } else {
    console.log('Form is invalid');
  }
}
}

