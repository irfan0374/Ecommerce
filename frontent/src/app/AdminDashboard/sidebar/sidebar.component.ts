import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private router:Router) { }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['login'])

  }

  ngOnInit(): void {
  }




  isOpen = true;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

}
