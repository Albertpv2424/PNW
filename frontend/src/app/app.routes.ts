import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/bets', component: ProfileComponent }, // Placeholder - will create specific components later
  { path: 'profile/history', component: ProfileComponent }, // Placeholder - will create specific components later
  { path: 'profile/edit', component: ProfileComponent }, // Placeholder - will create specific components later
  { path: '**', redirectTo: '' } // Redirect to home for any unknown routes
];