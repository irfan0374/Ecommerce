import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginform!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginAuth: AuthService,
    private toastr: ToastrService // Inject ToastrService
  ) {}

  ngOnInit(): void {
    this.loginform = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginform.valid) {
      const userData = {
        email: this.loginform.value.email,
        password: this.loginform.value.password
      };

      this.loginAuth.Login(userData).subscribe(
        (response: any) => {
          if (response && response.token) {  
            const token: string = response.token; 
            localStorage.setItem('token', token);

            this.toastr.success('Welcome back!', 'Login Successful!', { timeOut: 2000 });

            setTimeout(() => {
              if (response.is_superuser) {
                this.router.navigate(['admin/addProduct']);
              } else {
                this.router.navigate(['home']);
              }
            }, 1000);  
          }
        },
        (error: HttpErrorResponse) => {
          console.error("Login failed", error);

          // Show error alert with Toastr
          this.toastr.error('Invalid email or password!', 'Login Failed', {
            timeOut: 5000,
            closeButton: true,
            progressBar: true
          });
        }
      );
    } else {
      // Show warning alert if form is invalid
      this.toastr.warning('Please fill in the form correctly!', 'Invalid Form', {
        timeOut: 5000,
        closeButton: true,
        progressBar: true
      });
    }
  }
}
