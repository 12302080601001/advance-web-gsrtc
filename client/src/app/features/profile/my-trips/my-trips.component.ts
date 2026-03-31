import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-my-trips',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">My Trips</h2>
      
      <div *ngIf="loading" class="text-center py-8">Loading your bookings...</div>
      
      <div *ngIf="!loading && bookings.length === 0" class="card text-center">
        <p class="text-gray-600">No bookings found.</p>
        <a routerLink="/search" class="btn-primary inline-block mt-4">Book a Bus</a>
      </div>
      
      <div *ngFor="let booking of bookings" class="card mb-4">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-lg font-bold text-gsrtc-red">{{ booking.bus.busNumber }}</span>
              <span class="text-sm px-2 py-1 rounded" 
                    [class.bg-green-100]="booking.status === 'Confirmed'"
                    [class.bg-red-100]="booking.status === 'Cancelled'">
                {{ booking.status }}
              </span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div class="text-xl font-semibold">{{ booking.bus.departureTime }}</div>
                <div class="text-sm text-gray-600">{{ booking.bus.source }}</div>
              </div>
              <div class="text-right">
                <div class="text-xl font-semibold">{{ booking.bus.arrivalTime }}</div>
                <div class="text-sm text-gray-600">{{ booking.bus.destination }}</div>
              </div>
            </div>
            
            <div class="text-sm text-gray-600">
              📅 {{ booking.journeyDate | date:'fullDate' }} | 
              🪑 Seats: {{ booking.seatNumbers.join(', ') }} | 
              💰 ₹{{ booking.totalAmount }}
            </div>
          </div>
          
          <button *ngIf="booking.status === 'Confirmed' && isFutureDate(booking.journeyDate)"
                  (click)="cancelBooking(booking._id)"
                  class="text-red-600 hover:text-red-700 font-semibold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `
})
export class MyTripsComponent implements OnInit {
  bookings: any[] = [];
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.apiService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  isFutureDate(date: string): boolean {
    return new Date(date) > new Date();
  }

  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.apiService.cancelBooking(bookingId).subscribe({
        next: () => {
          this.loadBookings();
        },
        error: (err) => {
          alert(err.error?.message || 'Cancellation failed');
        }
      });
    }
  }
}