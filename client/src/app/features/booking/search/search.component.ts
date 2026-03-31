import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="card">
        <h1 class="text-3xl font-bold mb-6 text-center">Book Your Bus Ticket</h1>
        
        <form (ngSubmit)="onSearch()">
          <div class="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-2">From</label>
              <input type="text" [(ngModel)]="searchData.source" name="source" required
                     class="input-field" placeholder="Ahmedabad">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">To</label>
              <input type="text" [(ngModel)]="searchData.destination" name="destination" required
                     class="input-field" placeholder="Surat">
            </div>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium mb-2">Journey Date</label>
            <input type="date" [(ngModel)]="searchData.date" name="date" required
                   [min]="minDate" class="input-field">
          </div>
          
          <button type="submit" class="btn-primary w-full">
            Search Buses →
          </button>
        </form>
      </div>
      
      <!-- Popular Routes -->
      <div class="mt-8">
        <h3 class="text-lg font-semibold mb-3">Popular Routes</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button (click)="quickSearch('Ahmedabad', 'Surat')" 
                  class="text-left p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            🚌 Ahmedabad → Surat
          </button>
          <button (click)="quickSearch('Ahmedabad', 'Vadodara')" 
                  class="text-left p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            🚌 Ahmedabad → Vadodara
          </button>
          <button (click)="quickSearch('Surat', 'Mumbai')" 
                  class="text-left p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            🚌 Surat → Mumbai
          </button>
        </div>
      </div>
    </div>
  `
})
export class SearchComponent {
  searchData = {
    source: '',
    destination: '',
    date: new Date().toISOString().split('T')[0]
  };
  minDate = new Date().toISOString().split('T')[0];

  constructor(private router: Router) {}

  onSearch(): void {
    this.router.navigate(['/buses'], { queryParams: this.searchData });
  }

  quickSearch(source: string, destination: string): void {
    this.searchData.source = source;
    this.searchData.destination = destination;
    this.onSearch();
  }
}
