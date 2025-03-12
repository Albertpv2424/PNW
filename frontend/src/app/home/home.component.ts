import { Component, OnInit } from '@angular/core';
import { OddsService } from '../services/odds.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';
import { BetPopupComponent } from '../bet-popup/bet-popup.component';
import { BetSelectionsService } from '../services/bet-selections.service';
import { CombinedBetComponent } from '../combined-bet/combined-bet.component';
import { TeamBadgeService } from '../services/team-badge.service';

interface Sport {
  key: string;
  title: string;
  // ... otros campos que pueda tener
}

interface OddEvent {
  id?: string;  // Add this property
  sport_title?: string;
  league?: string;
  home_team: string;
  away_team: string;
  bookmakers: any[];
  commence_time?: string;
  // ... otros campos que vengan de la API
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, BetPopupComponent, CombinedBetComponent],
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
    private authService: AuthService,
    private betSelectionsService: BetSelectionsService,
    public teamBadgeService: TeamBadgeService  // Change from private to public
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
        // Add unique IDs to events if they don't have one
        const eventsWithIds = data.map((event, index) => ({
          ...event,
          id: event.id || `${sportKey}_${index}`
        }));
        
        this.odds = eventsWithIds.filter(event => 
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

  // Nuevas propiedades para el pop-up de apuesta
  showBetPopup = false;
  // Update the selectedBet property
  selectedBet = {
    teamName: '',
    betType: '',
    odds: 0,
    matchInfo: ''
  };
  
  // Nuevo método para abrir el pop-up de apuesta
  // Update the openBetPopup method to accept the matchId parameter
  // Modificar el método openBetPopup para que use el servicio de selecciones
  openBetPopup(teamName: string, betType: string, odds: number, homeTeam: string, awayTeam: string, matchId: string) {
    console.log('Abriendo popup para:', teamName, betType, odds);
    
    // Desactivamos el popup individual y solo usamos el servicio de selecciones
    // this.selectedBet = {
    //   teamName,
    //   betType,
    //   odds,
    //   matchInfo: `${homeTeam} vs ${awayTeam}`
    // };
    // this.showBetPopup = true;
    
    // Usamos el servicio de selecciones para apuestas combinadas
    this.betSelectionsService.addSelection({
      matchId,
      teamName,
      betType,
      odds,
      matchInfo: `${homeTeam} vs ${awayTeam}`
    });
  }

  // Método para cerrar el pop-up
  closeBetPopup() {
    this.showBetPopup = false;
  }

  // Método para procesar la apuesta
  placeBet(betData: {amount: number, odds: number}) {
    console.log('Apuesta realizada:', {
      ...this.selectedBet,
      amount: betData.amount,
      potentialWin: betData.amount * betData.odds
    });
    
    // Aquí implementarías la lógica para enviar la apuesta al backend
    // Por ejemplo:
    // this.betService.placeBet({
    //   teamName: this.selectedBet.teamName,
    //   betType: this.selectedBet.betType,
    //   odds: this.selectedBet.odds,
    //   amount: betData.amount
    // }).subscribe(...)
  }

  // Añadir este método para verificar si una selección está activa
  isSelectionActive(matchId: string, outcomeName: string): boolean {
    const selections = this.betSelectionsService.getCurrentSelections();
    return selections.some(s => 
      s.matchId === matchId && 
      (s.teamName === outcomeName || 
       (outcomeName === 'Draw' && s.teamName === 'Empate'))
    );
  }

  // Añade este método a tu clase HomeComponent
  getSelectedSportTitle(): string {
    const sport = this.sports.find(s => s.key === this.selectedSportKey);
    return sport ? sport.title : '';
  }

  /**
   * Obtiene la URL del escudo de un equipo
   */
  getTeamLogo(teamName: string): string {
    try {
      return this.teamBadgeService.getTeamBadgeUrl(teamName);
    } catch (error) {
      // Si falla, usar el método de respaldo
      return this.teamBadgeService.getFallbackBadge(teamName);
    }
  }

  /**
   * Fallback method for team logo errors
   */
  handleTeamLogoError(event: any, teamName: string): void {
    event.target.src = this.teamBadgeService.getFallbackBadge(teamName);
  }

  /**
   * Ordena las cuotas para mostrar: Local, Empate, Visitante
   */
  getOrderedOutcomes(outcomes: any[], homeTeam: string, awayTeam: string): any[] {
    if (!outcomes || outcomes.length === 0) return [];
    
    const ordered = [];
    
    // Buscar la cuota del equipo local
    const homeOutcome = outcomes.find(o => o.name === homeTeam);
    if (homeOutcome) ordered.push(homeOutcome);
    
    // Buscar la cuota de empate
    const drawOutcome = outcomes.find(o => o.name === 'Draw');
    if (drawOutcome) ordered.push(drawOutcome);
    
    // Buscar la cuota del equipo visitante
    const awayOutcome = outcomes.find(o => o.name === awayTeam);
    if (awayOutcome) ordered.push(awayOutcome);
    
    // Si por alguna razón no encontramos alguna cuota, devolvemos el array original
    return ordered.length === outcomes.length ? ordered : outcomes;
  }
}