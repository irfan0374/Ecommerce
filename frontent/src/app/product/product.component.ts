import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Router } from '@angular/router';
import { Product } from '../AdminDashboard/product-list/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  categories: string[] = ['vegitable', 'juice', 'fruits', 'nuts'];
  selectedCategory: string = 'all';
  products: Product[] = [];  
  filteredProducts: Product[] = [];  
  wishlist: number[] = []; 

  constructor(private productApi: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();

    
    this.productApi.wishlistService().subscribe((wishlistItems) => {
      this.wishlist = wishlistItems.map((item: { product: { id: any; }; }) => item.product.id);  
    });
  }

 
  isFavorited(product: Product): boolean {
    return this.wishlist.includes(product.id);
  }

  
  loadProducts(): void {
    this.productApi.productListInUser().subscribe(
      (res: Product[]) => {
        this.products = res;
        this.filteredProducts = res;
      },
      (err: any) => {
        console.log(err.message);
      }
    );
  }


  filterProducts(category: string): void {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredProducts = this.products; 
    } else {
      this.filteredProducts = this.products.filter((product) => {
        return product.category_name.toLowerCase() === category.toLowerCase();
      });
    }
  }

 
  toggleFavorite(event: Event, product: Product): void {
    event.stopPropagation();  // Prevent event propagation
    console.log(product,"product form the wishlist")

    if (this.isFavorited(product)) {
     
      this.productApi.removeFromwishlist(product.id).subscribe(() => {
        this.wishlist = this.wishlist.filter(id => id !== product.id); 
      });
    } else {
      
      this.productApi.addToWishlist(product.id).subscribe(() => {
        this.wishlist.push(product.id);  
      });
    }
  }

  // Navigate to product detail page
  navigateToDetail(id: number): void {
    this.router.navigate(['product_details', id]); 
  }
}
