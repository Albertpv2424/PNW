import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OddsService } from './services/odds.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Deportes Disponibles</h1>
      
      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div *ngIf="loading" class="alert alert-info">
        Cargando datos...
      </div>

      <div *ngFor="let sport of sports" class="card mb-3">
        <div class="card-body">
          <h2 class="card-title">{{ sport.title }}</h2>
          <button (click)="loadOdds(sport.key)" class="btn btn-primary">
            Ver Cuotas
          </button>
          
          <div *ngIf="selectedSportKey === sport.key && odds.length" class="mt-3">
            <h3>Cuotas para {{ sport.title }}</h3>
            <div *ngFor="let event of odds" class="card mt-2">
              <div class="card-header">
                {{ event.home_team }} vs {{ event.away_team }}
              </div>
              <div class="card-body">
                <div *ngFor="let bookmaker of event.bookmakers">
                  <div *ngFor="let outcome of bookmaker.markets[0].outcomes">
                    <span>{{ outcome.name }}: </span>
                    <strong>{{ outcome.price }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .card { margin-bottom: 10px; }
    .btn { margin: 5px; }
  `]
})
export class AppComponent implements OnInit {
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
        console.log('Deportes cargados:', data);
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
        console.log('Cuotas cargadas:', data);
      },
      error: (error) => {
        this.error = 'Error al cargar las cuotas';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }
}
