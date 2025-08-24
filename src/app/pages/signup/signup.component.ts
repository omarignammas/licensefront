import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/api.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast'; 
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AppFloatingconfigurator } from '../../layout/floatingconfigurator/floatingconfigurator.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,        
    ButtonModule,       
    CheckboxModule,     
    InputTextModule,    
    PasswordModule,    
    RippleModule,       
    ToastModule,        
    RouterModule,
    AppFloatingconfigurator,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  providers: [MessageService]
})
export class SignupComponent {
  username = '';
  fullname = '';
  email = '';
  password = '';
  errorMessage = '';
  checked = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSignup() {
    this.authService.signup({
      username: this.username,
      fullName: this.fullname,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        console.log('Signup success ✅', res);
  
        this.messageService.add({
          severity: 'success',
          summary: 'Signup Successful',
          detail: res.message || 'Your account has been created successfully!'
        });
  
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 1500);
      },
      error: (err) => {
        console.error('Signup failed ❌', err);
  
        let errorMsg = 'Something went wrong, please try again.';
        if (err.error && err.error.message) {
          errorMsg = err.error.message;
        }
  
        this.messageService.add({
          severity: 'error',
          summary: 'Signup Failed',
          detail: errorMsg
        });
      }
    });
  }
  
}