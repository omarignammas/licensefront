import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast'; // ← AJOUTÉ
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,        // ← AJOUTÉ pour ngModel
    ButtonModule,       // ← AJOUTÉ pour p-button
    CheckboxModule,     // ← AJOUTÉ pour p-checkbox
    InputTextModule,    // ← AJOUTÉ pour pInputText
    PasswordModule,     // ← AJOUTÉ pour p-password
    RippleModule,       // ← AJOUTÉ pour pRipple
    ToastModule,        // ← AJOUTÉ pour p-toast
    RouterModule
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
  checked = false; // ← AJOUTÉ pour p-checkbox

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSignup() {
    this.authService.signup({
      username: this.username,
      fullname: this.fullname,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        console.log('Signup success ✅', res);
  
        this.messageService.add({
          severity: 'success',
          summary: 'Signup Successful',
          detail: res || 'Your account has been created successfully!'
        });
  
        // après inscription, tu peux rediriger vers login
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 1500);
      },
      error: (err) => {
        console.error('Signup failed ❌', err);
  
        let errorMsg = 'Something went wrong, please try again.';
        if (err.error && err.error.message) {
          errorMsg = err.error.message; // si ton backend renvoie AlreadyExistsException
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