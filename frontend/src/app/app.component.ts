import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  showHeaderFooter = true;

  constructor(private router: Router) {}

  ngOnInit() {
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
        url.includes('/admin')
      );
    });
  }
}
