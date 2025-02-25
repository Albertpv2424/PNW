import { Component, OnInit } from '@angular/core';
import { OddsService } from '../services/odds.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styles: [`
    .container { padding: 20px; }
    .card { margin-bottom: 10px; }
    .btn { margin: 5px; }
  `]
})
export class HomeComponent implements OnInit {
  sports: any[] = [];
  odds: any[] = [];
  selectedSportKey: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private oddsService: OddsService) {}

  ngOnInit() {
    this.loadSports();
  }

  loadSports() {
    this.loading = true;
    this.error = '';

    this.oddsService.getSports().subscribe({
      next: (data) => {
        this.sports = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los deportes';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  loadOdds(sportKey: string) {
    this.loading = true;
    this.error = '';
    this.selectedSportKey = sportKey;

    this.oddsService.getOdds(sportKey).subscribe({
      next: (data) => {
        this.odds = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las cuotas';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }
}
