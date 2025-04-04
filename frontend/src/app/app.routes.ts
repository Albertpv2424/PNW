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
import { PromotionsComponent } from './admin/promotions/promotions.component';
import { BetVerificationComponent } from './admin/bet-verification/bet-verification.component';
import { BetsComponent } from './bets/bets.component';
import { HistoryComponent } from './history/history.component';

// Importar componentes de información
import { AboutComponent } from './about/about.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';

// Importar componentes de ayuda
import { FaqComponent } from './faq/faq.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { ResponsibleGamingComponent } from './responsible-gaming/responsible-gaming.component';
import { SupportComponent } from './support/support.component';
import { ChatAdminComponent } from './chat-admin/chat-admin.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },

  // Profile routes - updated to use separate components
  {
    path: 'profile',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProfileComponent },
      { path: 'edit', component: ProfileComponent },
      { path: 'bets', component: BetsComponent },
      { path: 'history', component: HistoryComponent }
    ]
  },

  { path: 'premios', component: PremiosComponent, canActivate: [AuthGuard] },
  { path: 'promociones', component: PromocionesComponent, canActivate: [AuthGuard] },
  { path: 'live', component: HomeComponent }, // Temporalmente redirige a Home
  { path: 'rewards', component: VideoRewardsComponent, canActivate: [AuthGuard] },

  // Rutas de información
  { path: 'about', component: AboutComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy', component: PrivacyComponent },

  // Rutas de ayuda
  { path: 'faq', component: FaqComponent },
  { path: 'how-to-play', component: HowToPlayComponent },
  { path: 'responsible-gaming', component: ResponsibleGamingComponent },
  { path: 'support', component: SupportComponent },

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
      { path: 'promotions', component: PromotionsComponent},
      { path: 'bet-verification', component: BetVerificationComponent },
      {
        path: 'chat',
        component: ChatAdminComponent,
      }
      // Add other admin routes here
    ]
  },

  // Ruta comodín para manejar rutas no encontradas
  { path: '**', redirectTo: '' }
];
