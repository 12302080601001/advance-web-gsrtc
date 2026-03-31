import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-md mx-auto card">
      <h2 class="text-2xl font-bold mb-6 text-center">Create Account</h2>
      
      <form (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Full Name</label>
          <input type="text" [(ngModel)]="name" name="name" required
                 class="input-field" placeholder="John Doe">
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Email</label>
          <input type="email" [(ngModel)]="email" name="email" required
                 class="input-field" placeholder="your@email.com">
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Phone Number</label>
          <input type="tel" [(ngModel)]="phone" name="phone" required
                 class="input-field" placeholder="9876543210">
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">Password</label>
          <input type="password" [(ngModel)]="password" name="password" required
                 class="input-field" placeholder="Minimum 6 characters">
        </div>
        
        <button type="submit" [disabled]="isLoading" 
                class="btn-primary w-full">
          {{ isLoading ? 'Creating Account...' : 'Register' }}
        </button>
      </form>
      
      <p class="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        Already have an account? <a routerLink="/login" class="text-gsrtc-red hover:underline">Login</a>
      </p>
      
      <div *ngIf="errorMessage" class="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
        {{ errorMessage }}
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  phone = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.register({ name: this.name, email: this.email, phone: this.phone, password: this.password })
      .subscribe({
        next: () => {
          this.router.navigate(['/search']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
          this.isLoading = false;
        }
      });
  }
}