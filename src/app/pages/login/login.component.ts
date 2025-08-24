import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, JwtResponse } from '../../service/api.service';
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
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  checked = false; 

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onLogin() {
    this.authService.signin({ email: this.email, password: this.password }).subscribe({
      next: (res: JwtResponse) => {
        console.log('Login success ✅', res);
        localStorage.setItem('token', res.token);

        this.messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: 'Welcome back!'
        });
        
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500); 
        
      },
      error: (err) => {
        console.error('Login failed ❌', err);
        // this.errorMessage = 'Invalid email or password';

        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: err.error.message || 'Invalid email or password'
        });
      }
    });
  }
}