import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomeComponent],
  templateUrl: './app.component.html',
  styles: [`
    .container { padding: 20px; }
    .card { margin-bottom: 10px; }
    .btn { margin: 5px; }
  `]
})
export class AppComponent {}
