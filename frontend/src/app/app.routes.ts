import { Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ProfileComponent } from './profile/profile.component';
import { PremiosComponent } from './premios/premios.component';
import { PromocionesComponent } from './promociones/promociones.component';
import { VideoRewardsComponent } from './video-rewards/video-rewards.component';
import { UsersComponent } from './admin/users/users.component';
import { PrizesComponent } from './admin/prizes/prizes.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/edit', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'premios', component: PremiosComponent, canActivate: [AuthGuard] },
  { path: 'promociones', component: PromocionesComponent, canActivate: [AuthGuard] },
  { path: 'live', component: HomeComponent }, // Temporalmente redirige a Home
  { path: 'rewards', component: VideoRewardsComponent, canActivate: [AuthGuard] },
  
  // Admin routes with layout
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'prizes', component: PrizesComponent },
      // Add other admin routes here
    ]
  },
  
  // Ruta comodín para manejar rutas no encontradas
  { path: '**', redirectTo: '' }
];