import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="card">
        <h2 class="text-2xl font-bold mb-6">Payment Details</h2>
        
        <div class="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 class="font-semibold mb-2">Booking Summary</h3>
          <p>Seats: {{ seatNumbers.join(', ') }}</p>
          <p>Total Amount: ₹{{ totalAmount }}</p>
          <p>Journey Date: {{ journeyDate | date:'mediumDate' }}</p>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">Payment Method</label>
          <select [(ngModel)]="paymentMethod" class="input-field">
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="upi">UPI</option>
          </select>
        </div>
        
        <div class="flex gap-3">
          <button (click)="cancelCheckout()" [disabled]="isProcessing"
                  class="w-1/3 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg transition font-semibold">
            Cancel
          </button>
          
          <button (click)="processPayment()" [disabled]="isProcessing || !totalAmount || totalAmount <= 0"
                  class="btn-primary flex-1 py-2 text-white font-semibold rounded-lg shadow-md transition"
                  [class.opacity-50]="isProcessing || !totalAmount || totalAmount <= 0">
            {{ isProcessing ? 'Processing...' : 'Pay ₹' + (totalAmount || 0) }}
          </button>
        </div>
        
        <div *ngIf="errorMessage" class="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 rounded-lg">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  busId = '';
  seatNumbers: string[] = [];
  journeyDate = '';
  totalAmount = 0;
  paymentMethod = 'credit_card';
  isProcessing = false;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.busId = params['busId'];
      this.seatNumbers = params['seats']?.split(',') || [];
      this.journeyDate = params['date'];
      this.totalAmount = +params['total'];
    });
  }

  processPayment(): void {
    this.isProcessing = true;
    this.errorMessage = '';
    
    this.apiService.processPayment({ amount: this.totalAmount, paymentMethod: this.paymentMethod })
      .subscribe({
        next: (paymentResponse) => {
          if (paymentResponse.success) {
            this.createBooking(paymentResponse.paymentId);
          } else {
            this.errorMessage = 'Payment failed. Please try again.';
            this.isProcessing = false;
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Payment processing failed';
          this.isProcessing = false;
        }
      });
  }

  createBooking(paymentId: string): void {
    const bookingData = {
      busId: this.busId,
      seatNumbers: this.seatNumbers,
      journeyDate: this.journeyDate,
      totalAmount: this.totalAmount,
      paymentId: paymentId
    };
    
    this.apiService.createBooking(bookingData).subscribe({
      next: () => {
        this.router.navigate(['/my-trips']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Booking failed';
        this.isProcessing = false;
      }
    });
  }

  cancelCheckout(): void {
    // Navigate back to the seat map (or search if preferred)
    if (this.busId && this.journeyDate) {
      this.router.navigate(['/seats', this.busId], { queryParams: { date: this.journeyDate } });
    } else {
      this.router.navigate(['/search']);
    }
  }
}
