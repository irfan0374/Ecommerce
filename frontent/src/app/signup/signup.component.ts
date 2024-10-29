import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirm_password')?.value;
    if (password !== confirmPassword) {
      control.get('confirm_password')?.setErrors({ passwordMismatch: true });
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const userData = {
        username: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password1: this.signupForm.value.password,
   
      };

      this.authService.register(userData).subscribe(
        (response: any) => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']);
        },
        (error: HttpErrorResponse) => {
          console.error('Registration failed', error);

          if (error.status === 400) {
            console.error('Bad Request:', error.error);
          }
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
