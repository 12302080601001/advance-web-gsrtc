import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-seat-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="card mb-4">
        <h2 class="text-xl font-bold">Select Your Seats</h2>
        <p class="text-gray-600">{{ busInfo?.source }} → {{ busInfo?.destination }}</p>
        <p class="text-sm">Departure: {{ busInfo?.departureTime }} | Fare: ₹{{ fare }}/seat</p>
      </div>
      
      <div *ngIf="loading" class="text-center py-8">Loading seat map...</div>
      
      <div *ngIf="!loading" class="card">
        <div class="grid grid-cols-4 gap-3 mb-6">
          <div *ngFor="let seat of seats" 
               (click)="toggleSeat(seat)"
               [class]="getSeatClass(seat)"
               class="p-3 text-center rounded-lg cursor-pointer transition font-semibold">
            {{ seat.number }}
          </div>
        </div>
        
        <div class="border-t pt-4 mt-4">
          <div class="flex justify-between items-center mb-4">
            <div class="space-x-3">
              <span class="inline-block w-4 h-4 bg-green-500 rounded"></span>
              <span class="text-sm">Available</span>
              <span class="inline-block w-4 h-4 bg-red-500 rounded ml-2"></span>
              <span class="text-sm">Booked</span>
              <span class="inline-block w-4 h-4 bg-blue-500 rounded ml-2"></span>
              <span class="text-sm">Selected</span>
            </div>
            <div class="text-lg font-bold">
              Total: ₹{{ selectedSeats.length * fare }}
            </div>
          </div>
          
          <button (click)="proceedToCheckout()" 
                  [disabled]="selectedSeats.length === 0"
                  class="btn-primary w-full"
                  [class.opacity-50]="selectedSeats.length === 0">
            Book {{ selectedSeats.length }} Seat(s) → 
          </button>
        </div>
      </div>
    </div>
  `
})
export class SeatMapComponent implements OnInit {
  seats: any[] = [];
  selectedSeats: any[] = [];
  busInfo: any = null;
  busId = '';
  journeyDate = '';
  fare = 0;
  loading = true;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.busId = this.route.snapshot.params['busId'];
    this.route.queryParams.subscribe(params => {
      this.journeyDate = params['date'];
      if (params['fare']) {
        this.fare = +params['fare'];
      }
      this.loadSeatMap();
    });
  }

  loadSeatMap(): void {
    this.apiService.getSeatMap(this.busId, this.journeyDate).subscribe({
      next: (data) => {
        this.busInfo = data.bus;
        this.seats = data.seats;
        if (data.bus && data.bus.fare) {
          this.fare = data.bus.fare;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  toggleSeat(seat: any): void {
    if (seat.status === 'booked') return;
    
    const index = this.selectedSeats.findIndex(s => s.number === seat.number);
    if (index === -1) {
      this.selectedSeats.push(seat);
    } else {
      this.selectedSeats.splice(index, 1);
    }
  }

  getSeatClass(seat: any): string {
    if (seat.status === 'booked') return 'bg-red-500 text-white cursor-not-allowed opacity-50';
    if (this.selectedSeats.find(s => s.number === seat.number)) return 'bg-blue-500 text-white';
    return 'bg-green-500 text-white hover:bg-green-600';
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout'], {
      queryParams: {
        busId: this.busId,
        seats: this.selectedSeats.map(s => s.number).join(','),
        date: this.journeyDate,
        total: this.selectedSeats.length * this.fare
      }
    });
  }
}