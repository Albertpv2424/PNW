import { Component, OnInit } from '@angular/core';
import { OddsService } from '../services/odds.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';

interface Sport {
  key: string;
  title: string;
  // ... otros campos que pueda tener
}

interface OddEvent {
  sport_title?: string;
  league?: string;
  home_team: string;
  away_team: string;
  bookmakers: any[];
  commence_time?: string; // Add this property
  // ... otros campos que vengan de la API
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  sports: Sport[] = [];
  odds: OddEvent[] = [];
  selectedSportKey: string = '';
  loading: boolean = true;
  error: string = '';
  username: string = '';

  // Lista de ligas permitidas
  allowedLeagues = [
    'La Liga',
    'Serie A',
    'Ligue 1',
    'Bundesliga',
    'Premier League',
    'UEFA Champions League',
    'UEFA Europa League',
    'UEFA Europa Conference League'
  ];

  // Lista de deportes permitidos
  allowedSports = [
    'soccer', // Para fútbol
    'soccer_uefa_champs_league',
    'soccer_uefa_europa_league',
    'soccer_uefa_europa_conference_league',
    'soccer_spain_la_liga',
    'soccer_italy_serie_a',
    'soccer_france_ligue_one',
    'soccer_germany_bundesliga',
    'soccer_england_league1',
  ];

  constructor(
    private oddsService: OddsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadSports();
    this.loadUserInfo();
  }

  loadUserInfo() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.username = user.nick;
    }
  }

  logout(): void {
    this.authService.logout();
  }

  loadSports() {
    this.loading = true;
    this.error = '';

    this.oddsService.getSports().subscribe({
      next: (data: Sport[]) => {
        // Filtramos solo los deportes que queremos mostrar
        this.sports = data.filter(sport => 
          this.allowedSports.includes(sport.key)
        );
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
    this.selectedSportKey = sportKey;
    this.oddsService.getOdds(sportKey).subscribe({
      next: (data: OddEvent[]) => {
        this.odds = data.filter(event => 
          this.allowedLeagues.some(league => 
            event.sport_title?.includes(league) || 
            event.league?.includes(league)
          )
        );
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