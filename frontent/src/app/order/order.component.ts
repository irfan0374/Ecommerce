import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
interface OrderProduct {
  category_name: string;
  created_at: string;
  description: string;
  id: number;
  image: string;
  price: string;
  title: string;
}

interface Order {
  address: string;
  id: number;
  invoice_number: string;
  ordered_date: string;
  payment_method: string;
  product: OrderProduct;
  quantity: number;
  status: string;
  total_price: string;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter: string = 'all';
  searchTerm: string = '';

  constructor(private productApi: ProductService, private router:Router ,private toastr: ToastrService) {}
  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.productApi.listOrderService().subscribe({
      next: (res: Order[]) => {
        this.orders = res;
        this.filterOrders();
      },
      error: (error) => {
        console.error('Error loading orders:', error.message);
      }
    });
  }

  filterOrders() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter;
      return matchesStatus
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'order-placed': 'status-pending',
      
      'on-transit': 'status-shipped',
      'order-delivered': 'status-delivered',
      'order-cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  }

  trackOrder(order: Order) {
    
  }

  cancelOrder(orderId: number) {
    this.productApi.cancelOrder(orderId).subscribe(
        (response:any) => {
          this.toastr.error('Order Cancelled', '', {
            timeOut: 1000,
          
          });
          this.loadOrders();
         
            
        },
        (error:any) => {
            console.error('Error canceling the order:', error);
        }
    );
}
navigate(){
  this.router.navigate(['product'])
}

  returnOrder(order: Order) {

  }
}