import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-bus-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">
        Buses from {{ source }} to {{ destination }}
        <span class="text-sm text-gray-600">on {{ date | date:'fullDate' }}</span>
      </h2>
      
      <div *ngIf="loading" class="text-center py-8">
        <div class="text-2xl">🔄 Loading buses...</div>
      </div>
      
      <div *ngIf="!loading && buses.length === 0" class="card text-center">
        <p class="text-gray-600">No buses found for this route.</p>
      </div>
      
      <div *ngFor="let bus of buses" class="card mb-4 hover:shadow-xl transition">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <span class="text-lg font-bold text-gsrtc-red">{{ bus.busNumber }}</span>
              <span class="text-sm bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">{{ bus.busType }}</span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div class="text-xl font-semibold">{{ bus.departureTime }}</div>
                <div class="text-sm text-gray-600">{{ bus.source }}</div>
              </div>
              <div class="text-right">
                <div class="text-xl font-semibold">{{ bus.arrivalTime }}</div>
                <div class="text-sm text-gray-600">{{ bus.destination }}</div>
              </div>
            </div>
            
            <div class="text-sm text-gray-600">
              ⏱️ Duration: {{ bus.duration }} | 🪑 Seats Left: {{ bus.availableSeats }}/{{ bus.totalSeats }}
            </div>
            
            <div *ngIf="bus.amenities?.length" class="mt-2 flex flex-wrap gap-2">
              <span *ngFor="let amenity of bus.amenities" class="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                {{ amenity }}
              </span>
            </div>
          </div>
          
          <div class="mt-4 md:mt-0 text-right">
            <div class="text-2xl font-bold text-gsrtc-red">₹{{ bus.fare }}</div>
            <button (click)="selectBus(bus)" [disabled]="bus.availableSeats === 0"
                    class="mt-2 btn-primary px-4 py-2 text-sm"
                    [class.opacity-50]="bus.availableSeats === 0">
              {{ bus.availableSeats === 0 ? 'Sold Out' : 'Select Seats' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BusListComponent implements OnInit {
  buses: any[] = [];
  loading = true;
  source = '';
  destination = '';
  date = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.source = params['source'];
      this.destination = params['destination'];
      this.date = params['date'];
      this.searchBuses();
    });
  }

  searchBuses(): void {
    this.loading = true;
    console.log('Fetching buses for:', this.source, this.destination, this.date);
    this.apiService.searchBuses({ source: this.source, destination: this.destination, date: this.date })
      .subscribe({
        next: (data) => {
          console.log('Received buses data:', data);
          this.buses = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching buses:', err);
          this.loading = false;
        }
      });
  }

  selectBus(bus: any): void {
    this.router.navigate(['/seats', bus._id], { queryParams: { date: this.date, fare: bus.fare } });
  }
}