import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { SearchComponent } from './features/booking/search/search.component';
import { BusListComponent } from './features/booking/bus-list/bus-list.component';
import { SeatMapComponent } from './features/booking/seat-map/seat-map.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { MyTripsComponent } from './features/profile/my-trips/my-trips.component';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'search', component: SearchComponent },
  { path: 'buses', component: BusListComponent },
  { path: 'seats/:busId', component: SeatMapComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'my-trips', component: MyTripsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/search' }
];