import { Component, OnInit } from '@angular/core';
import { OddsService } from '../services/odds.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { BetPopupComponent } from '../bet-popup/bet-popup.component';
import { BetSelectionsService } from '../services/bet-selections.service';
import { CombinedBetComponent } from '../combined-bet/combined-bet.component';
import { TeamBadgeService } from '../services/team-badge.service';
import { HeaderComponent } from '../header/header.component';

interface Sport {
  key: string;
  title: string;
  country?: string;  // Add the country property as optional
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
  imports: [CommonModule, RouterModule, BetPopupComponent, CombinedBetComponent, HeaderComponent],
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
  profileImage: string | null = null; // Add this property
  featuredMatches: OddEvent[] = [];

  // Lista de ligas permitidas
  allowedLeagues = [
    'La Liga',
    'Serie A',
    'Bundesliga',
    'Premier League',
    'NBA', // Added NBA and removed Ligue 1
    'UEFA Champions League',
    'UEFA Europa League',
    'UEFA Europa Conference League'
  ];

  // Lista de deportes permitidos
  allowedSports = [
    'soccer', // Para fútbol
    'basketball_nba', // Changed from 'basketball' to 'basketball_nba'
    'soccer_uefa_champs_league',
    'soccer_uefa_europa_league',
    'soccer_uefa_europa_conference_league',
    'soccer_spain_la_liga',
    'soccer_italy_serie_a',
    'soccer_germany_bundesliga',
    // Removed soccer_france_ligue_one
  ];

  constructor(
    private oddsService: OddsService,
    public authService: AuthService,
    private betSelectionsService: BetSelectionsService,
    public teamBadgeService: TeamBadgeService,
    private router: Router  // Add Router to constructor
  ) {}

  // Modificar el método ngOnInit para redirigir a los administradores
  ngOnInit() {
    // Check if user is admin and redirect to dashboard
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && this.authService.isAdmin()) {
      // Redirect admin users to the dashboard
      this.router.navigate(['/admin/dashboard']);
      return;
    }
    
    // Continue with normal initialization for non-admin users
    this.loadSports();
    this.loadUserInfo();
    this.loadFeaturedMatches(); // This will now work correctly
  }

  // Make sure this method is defined in the class
  loadFeaturedMatches() {
    // Cargar partidos destacados de diferentes ligas
    const featuredSports = ['soccer_spain_la_liga', 'soccer_uefa_champs_league', 'basketball_nba'];

    this.featuredMatches = []; // Limpiar los partidos destacados existentes
    let loadedCount = 0;
    const maxFeaturedMatches = 6; // Aumentamos a 6 partidos destacados

    // Cargar partidos de cada liga destacada hasta llegar al máximo
    featuredSports.forEach(sportKey => {
      if (loadedCount >= maxFeaturedMatches) return; // Ya tenemos suficientes partidos

      this.oddsService.getOdds(sportKey).subscribe({
        next: (data: OddEvent[]) => {
          if (data && data.length > 0 && loadedCount < maxFeaturedMatches) {
            // Añadir IDs a los eventos
            const eventsWithIds = data.map((event, index) => ({
              ...event,
              id: event.id || `${sportKey}_${index}`
            }));

            // Filtrar por ligas permitidas
            const filteredEvents = eventsWithIds.filter(event =>
              this.allowedLeagues.some(league =>
                event.sport_title?.includes(league) ||
                event.league?.includes(league)
              )
            );

            // Mezclar aleatoriamente los partidos para mostrar diferentes cada vez
            const shuffledEvents = this.shuffleArray([...filteredEvents]);

            // Tomar solo los partidos necesarios para llegar al máximo
            const matchesToAdd = Math.min(2, maxFeaturedMatches - loadedCount);
            const leagueEvents = shuffledEvents.slice(0, matchesToAdd);

            // Actualizar contador
            loadedCount += leagueEvents.length;

            // Añadir a los partidos destacados
            this.featuredMatches = [...this.featuredMatches, ...leagueEvents];
          }
        },
        error: (error) => {
          console.error('Error cargando partidos destacados:', error);
        }
      });
    });
  }
  loadUserInfo() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.username = user.nick;
      this.profileImage = user.profile_image || null; // Get the profile image
    }
  }

  // Add this method to get user initials for the profile image placeholder
  getUserInitials(): string {
    if (!this.username) return '';

    const names = this.username.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
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
        // Map sports with their corresponding countries
        const sportsWithCountries = data.map(sport => {
          const countryMap: { [key: string]: string } = {
            'soccer_spain_la_liga': 'Spain',
            'soccer_italy_serie_a': 'Italy',
            'soccer_germany_bundesliga': 'Germany',
            'basketball_nba': 'USA', // Updated to match the new key
            'soccer': 'Europe',
            'soccer_uefa_champs_league': 'Europe',
            'soccer_uefa_europa_league': 'Europe',
            'soccer_uefa_europa_conference_league': 'Europe'
          };

          return {
            ...sport,
            country: countryMap[sport.key] || 'Europe'  // Default to Europe if no specific country
          };
        });

        // Filter allowed sports
        this.sports = sportsWithCountries.filter(sport =>
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

  // Método para mezclar un array aleatoriamente (algoritmo Fisher-Yates)
  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  loadOdds(sportKey: string) {
    this.loading = true;
    this.selectedSportKey = sportKey;
    this.error = ''; // Limpiar errores anteriores

    this.oddsService.getOdds(sportKey).subscribe({
      next: (data: OddEvent[]) => {
        // Add unique IDs to events if they don't have one
        const eventsWithIds = data.map((event, index) => ({
          ...event,
          id: event.id || `${sportKey}_${index}`
        }));

        // Filtrar por ligas permitidas
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
  openBetPopup(teamName: string, betType: string, odds: number, homeTeam: string, awayTeam: string, matchId: string, leagueName?: string) {
    console.log('Abriendo popup para:', teamName, betType, odds);
  
    // Create a more descriptive matchInfo
    const matchInfo = leagueName 
      ? `${leagueName}: ${homeTeam} vs ${awayTeam}` 
      : `${homeTeam} vs ${awayTeam}`;
  
    // Usamos el servicio de selecciones para apuestas combinadas
    this.betSelectionsService.addSelection({
      matchId,
      teamName,
      betType,
      odds,
      matchInfo,
      homeTeam,
      awayTeam,
      leagueName
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

  /**
   * Gets the country flag URL using the country-flags API
   */
  getCountryFlag(country?: string): string {
    if (!country) return '';

    const countryMap: { [key: string]: string } = {
      'Spain': 'es',
      'England': 'gb',
      'Italy': 'it',
      'Germany': 'de',
      'USA': 'us',  // Added for NBA
      'Europe': 'eu',
      'France': 'fr', // Added for European competitions
      'Portugal': 'pt',
      'Netherlands': 'nl',
      'Belgium': 'be',
      'Scotland': 'gb-sct',
      'Turkey': 'tr',
      'Greece': 'gr',
      'Austria': 'at',
      'Switzerland': 'ch',
      'Croatia': 'hr',
      'Czech Republic': 'cz',
      'Denmark': 'dk',
      'Norway': 'no',
      'Sweden': 'se',
      'Poland': 'pl',
      'Ukraine': 'ua',
      'Serbia': 'rs',
      'Romania': 'ro',
      'Bulgaria': 'bg',
      'Hungary': 'hu'
    };

    const countryCode = countryMap[country] || country.toLowerCase();
    return `https://flagcdn.com/24x18/${countryCode}.png`;
  }

  /**
   * Handles flag loading errors
   */
  handleFlagError(event: any, country?: string): void {
    // Set a default flag icon or hide the element
    event.target.style.display = 'none';
  }

  // Add this tracking function to your HomeComponent class
  // Update the tracking function to be more robust
  trackByMatch(index: number, match: OddEvent): string {
  // Create a unique identifier using multiple properties and always include the index
  return match.id || `${match.sport_title || ''}_${match.league || ''}_${match.home_team || ''}_${match.away_team || ''}_${match.commence_time || ''}_${index}`;
  }

  // Add this property for the user menu dropdown
  isMenuOpen: boolean = false;
  
  // Add these methods for menu toggle
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
