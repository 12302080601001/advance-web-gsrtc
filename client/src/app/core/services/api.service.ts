import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // Bus endpoints
  searchBuses(params: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/buses/search`, { params });
  }

  getSeatMap(busId: string, date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/buses/${busId}/seats`, { params: { date } });
  }

  // Booking endpoints
  createBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings/create`, bookingData, {
      headers: this.getHeaders()
    });
  }

  getMyBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/my-bookings`, {
      headers: this.getHeaders()
    });
  }

  cancelBooking(bookingId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/bookings/${bookingId}/cancel`, {}, {
      headers: this.getHeaders()
    });
  }

  // Payment endpoint
  processPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payment/process`, paymentData, {
      headers: this.getHeaders()
    });
  }
}