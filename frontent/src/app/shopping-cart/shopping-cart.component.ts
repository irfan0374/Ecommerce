

// shopping-cart.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems$!: Observable<any[]>;
  total$!: Observable<number>;

  constructor(private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.listCartItem();
    this.total$ = this.cartItems$.pipe(
      map(items => items.reduce((acc, item) => acc + this.calculateTotalPrice(item), 0))
    );
  }

  listCartItem() {
    this.cartItems$ = this.productService.cartListService();
  }

  removeItem(cartId: number, productId: number) {
    this.productService.deleteCartItem(cartId, productId).subscribe({
      next: () => {
        console.log("Successfully deleted");
        this.listCartItem();
        this.total$ = this.cartItems$.pipe(
          map(items => items.reduce((acc, item) => acc + this.calculateTotalPrice(item), 0))
        );
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  updateQuantity(cartId: number, productId: number, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const quantity = Number(inputElement.value);

    if (quantity < 1) return;

    this.productService.updateTheCart(cartId, productId, quantity).subscribe({
      next: () => {
        console.log("Product quantity updated successfully");
        this.listCartItem();
        this.total$ = this.cartItems$.pipe(
          map(items => items.reduce((acc, item) => acc + this.calculateTotalPrice(item), 0))
        );
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  buy(id: number, quantity: number) {
    this.router.navigate(['placeOrder', id], {
      queryParams: { quantity }
    });
  }

  calculateTotalPrice(item: any): number {
    const price = Number(item.product?.price) || 0;
    return price * item.quantity;
  }

  checkout() {
    this.cartItems$.subscribe(cartItems => {
      this.router.navigate(['placeOrder'], {
        state: { cartItems }
      });
    });
  }


  navigate(){
    this.router.navigate(['product'])
  }
}