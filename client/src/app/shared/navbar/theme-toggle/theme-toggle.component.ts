import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="toggleTheme()" class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition">
      <span *ngIf="!(isDark$ | async)">🌙</span>
      <span *ngIf="isDark$ | async">☀️</span>
    </button>
  `
})
export class ThemeToggleComponent {
  // Use inject() to get the service safely
  private themeService = inject(ThemeService);
  
  // Now this can be initialized immediately
  isDark$ = this.themeService.isDark$;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}