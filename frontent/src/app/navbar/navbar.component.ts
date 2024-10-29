import { Component, OnInit } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  constructor(
    // private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  logout(): void {
  localStorage.removeItem('token')
    this.router.navigate(['login']); 
  }
}


