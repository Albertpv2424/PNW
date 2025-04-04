import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule]
})
export class AppComponent implements OnInit {
  title = 'frontend';
  showHeaderFooter = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Detectar cambios de ruta y hacer scroll al inicio
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });

    // Subscribe to router events to determine when to show/hide header and footer
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide header and footer on profile, login, register, and admin pages
      const url = event.url;
      this.showHeaderFooter = !(
        url.includes('/profile') || 
        url.includes('/login') || 
        url.includes('/register') || 
        url.includes('/admin') ||
        url.includes('/reset-password')
      );
    });
  }
}
