import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { NotificationComponent } from './auth/notification/notification.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CommonModule,
    ChatComponent,
    NotificationComponent
  ]
})
export class AppComponent implements OnInit {
  title = 'frontend';
  showHeaderFooter = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Detectar cambios de ruta y hacer scroll al inicio
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Scroll to top on navigation
      window.scrollTo(0, 0);

      // Check current route to determine when to show/hide header, footer and chat
      const url = event.url;

      // Hide header, footer and chat on these pages
      this.showHeaderFooter = !(
        url.includes('/profile') ||
        url.includes('/login') ||
        url.includes('/register') ||
        url.includes('/admin') ||
        url.includes('/reset-password')
      );

      console.log('Route changed to:', url, 'showHeaderFooter:', this.showHeaderFooter);
    });
  }
}
