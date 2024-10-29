import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  Users: any
  
  constructor(private fb: ProductService) { }

  ngOnInit(): void {
    lastValueFrom(this.fb.UserList()).then((res) => {
      this.Users = res
    }).catch(err => console.log(err.message))
  }

  toggleStatus(userId: number,userActive:any) {
    this.fb.toggleUserStatus(userId).subscribe(
      (response) => {
      const user = this.Users.find((data: { id: number; }) => data.id === userId);

      if (user) {
        user.is_active = response.is_active;
      }
        console.log(response.is_active);
      },
      (error) => {
        console.error( error);
      }
    );

  }
}
