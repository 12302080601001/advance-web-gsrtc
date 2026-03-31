import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <nav class="bg-white dark:bg-gray-800 shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <!-- Logo -->
          <div class="flex items-center space-x-2">
            <div class="text-2xl">🚌</div>
            <span class="text-xl font-bold text-gsrtc-red">GSRTC</span>
            <span class="text-sm text-gray-600 dark:text-gray-400">Bus Booking</span>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden md:flex space-x-6">
            <a routerLink="/search" routerLinkActive="text-gsrtc-red" [routerLinkActiveOptions]="{exact: true}" 
               class="text-gray-700 dark:text-gray-300 hover:text-gsrtc-red transition">
              Search Buses
            </a>
            <a *ngIf="isAuthenticated" routerLink="/my-trips" routerLinkActive="text-gsrtc-red"
               class="text-gray-700 dark:text-gray-300 hover:text-gsrtc-red transition">
              My Trips
            </a>
          </div>
          
          <!-- Right Section -->
          <div class="flex items-center space-x-4">
            <app-theme-toggle></app-theme-toggle>
            
            <div *ngIf="!isAuthenticated" class="space-x-2">
              <a routerLink="/login" class="btn-secondary">Login</a>
              <a routerLink="/register" class="btn-primary">Register</a>
            </div>
            
            <div *ngIf="isAuthenticated" class="flex items-center space-x-3">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                👤 {{ currentUser?.name }}
              </span>
              <button (click)="logout()" class="text-red-600 hover:text-red-700 font-semibold">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  isAuthenticated = false;
  currentUser: any = null;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}