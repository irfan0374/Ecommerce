import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';

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
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter: string = 'all';
  searchTerm: string = '';
  
  orderStatuses = [
    'order-placed',
    'on-transit',
    'order-delivered',
    'order-cancelled'
  ];

  constructor(private productApi: ProductService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.productApi.getAllOrders().subscribe({
      next: (res: Order[]) => {
      
        this.orders = res;
      },
      error: (error: any) => {
        console.error('Error loading orders:', error.message);
      }
    });
  }

  

  updateOrderStatus(order: any, newStatus: string) {
   
    this.productApi.updateOrderStatus(order.id, newStatus).subscribe({
      next: (response) => {
        order.status = newStatus;
        console.log('Order status updated successfully');
      },
      error: (error) => {
        console.error('Error updating order status:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
   
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'order-placed': 'status-pending',
      'on-transit': 'status-processing',
      'order-delivered': 'status-delivered',
      'order-cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  }
}