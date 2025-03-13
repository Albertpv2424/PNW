import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeamBadgeService {
  
  constructor() { }
  
  /**
   * Obtiene la URL del escudo de un equipo usando API-Football
   * @param teamName Nombre del equipo
   * @returns URL del escudo del equipo
   */
  getTeamBadgeUrl(teamName: string): string {
    // Normalizar el nombre del equipo
    const normalizedName = teamName.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-');
    
    // Check if it's an NBA team
    if (this.isNBATeam(normalizedName)) {
      return `https://a.espncdn.com/i/teamlogos/nba/500/${this.getNBATeamAbbreviation(normalizedName)}.png`;
    }
    
    // For soccer teams, use the existing API
    const teamId = this.getTeamId(normalizedName);
    if (teamId !== 0) {
      return `https://media.api-sports.io/football/teams/${teamId}.png`;
    }
    
    // Si no se encuentra el ID, usar el fallback
    return this.getFallbackBadge(teamName);
  }
  
  /**
   * Mapeo de nombres de equipos a IDs de la API
   * @param normalizedName Nombre normalizado del equipo
   * @returns ID del equipo en la API
   */
  private getTeamId(normalizedName: string): number {
    const teamIds: {[key: string]: number} = {
      // La Liga (España)
      'barcelona': 529,
      'real-madrid': 541,
      'atletico-madrid': 530,
      'sevilla': 536,
      'valencia': 532,
      'villarreal': 533,
      'athletic-bilbao': 531,
      'real-sociedad': 548,
      'betis': 543,
      'celta-vigo': 538,
      'espanyol': 540,
      'getafe': 546,
      'mallorca': 798,
      'osasuna': 558,
      'rayo-vallecano': 728,
      'valladolid': 720,
      'girona': 547,
      'alaves': 542,
      'las-palmas': 472,
      'granada': 715,
      'almeria': 723,
      'cadiz': 724,
      'leganes': 726,
      
      // Premier League (Inglaterra)
      'manchester-city': 50,
      'manchester-united': 33,
      'liverpool': 40,
      'chelsea': 49,
      'arsenal': 42,
      'tottenham': 47,
      'aston-villa': 66,
      'newcastle': 34,
      'west-ham': 48,
      'brighton': 51,
      'crystal-palace': 52,
      'brentford': 55,
      'fulham': 36,
      'wolves': 39,
      'bournemouth': 35,
      'nottingham-forest': 65,
      'everton': 45,
      'leicester': 46,
      'southampton': 41,
      'burnley': 44,
      'ipswich': 60,
      'luton': 1359,
      'sheffield-united': 62,
      
      // Serie A (Italia)
      'juventus': 496,
      'milan': 489,
      'inter': 505,
      'napoli': 492,
      'roma': 497,
      'lazio': 487,
      'atalanta': 499,
      'fiorentina': 502,
      'bologna': 500,
      'torino': 503,
      'monza': 1579,
      'udinese': 494,
      'sassuolo': 488,
      'empoli': 511,
      'salernitana': 514,
      'lecce': 867,
      'verona': 504,
      'cagliari': 490,
      'genoa': 495,
      'como': 517,
      'venezia': 607,
      'parma': 523,
      
      // Bundesliga (Alemania)
      'bayern-munich': 157,
      'borussia-dortmund': 165,
      'bayer-leverkusen': 168,
      'rb-leipzig': 173,
      'eintracht-frankfurt': 169,
      'wolfsburg': 161,
      'borussia-monchengladbach': 163,
      'hoffenheim': 167,
      'freiburg': 160,
      'mainz': 164,
      'union-berlin': 182,
      'koln': 192,
      'hertha-berlin': 159,
      'augsburg': 170,
      'stuttgart': 172,
      'werder-bremen': 162,
      'bochum': 176,
      'holstein-kiel': 178,
      'heidenheim': 188,
      'st-pauli': 189,
      
      // Ligue 1 (Francia)
      'paris-saint-germain': 85,
      'marseille': 81,
      'lyon': 80,
      'monaco': 91,
      'lille': 79,
      'rennes': 94,
      'nice': 84,
      'lens': 116,
      'strasbourg': 95,
      'reims': 93,
      'montpellier': 82,
      'toulouse': 96,
      'nantes': 83,
      'angers': 77,
      'clermont': 99,
      'brest': 106,
      'metz': 112,
      'le-havre': 78,
      'auxerre': 108,
      'saint-etienne': 1063,
      
      // Champions League
 
      'porto': 212,
      'benfica': 211,
      'psv': 197,
      'feyenoord': 196,
      'celtic': 247,
      'red-star-belgrade': 598,
      'salzburg': 571,
      'shakhtar': 550,
      'young-boys': 565,
      'copenhagen': 400,
      'braga': 214,
      'sparta-prague': 628,
      'dinamo-zagreb': 620,
      'slovan-bratislava': 651,
      'antwerp': 1393,

      'galatasaray': 645,
      
      // Europa League

      'ajax': 194,

      'rangers': 248,
      'olympiacos': 553,
      'qarabag': 556,
      'maccabi-tel-aviv': 605,
      'slavia-prague': 567,
      'paok': 619,
      'fenerbahce': 611,

      
      // Conference League

      'az-alkmaar': 195,
      'gent': 631,
      'club-brugge': 569,
      'rapid-wien': 574,
      'viktoria-plzen': 566,
      'ludogorets': 566,
      'apoel': 578,
      'legia-warsaw': 357,
      'fc-copenhagen': 400,
      'molde': 329,
      'bodo-glimt': 327,
      // NBA Teams
      'boston-celtics': 2,
      'brooklyn-nets': 3,
      'new-york-knicks': 24,
      'philadelphia-76ers': 27,
      'toronto-raptors': 38,
      'chicago-bulls': 6,
      'cleveland-cavaliers': 7,
      'detroit-pistons': 10,
      'indiana-pacers': 15,
      'milwaukee-bucks': 21,
      'atlanta-hawks': 1,
      'charlotte-hornets': 5,
      'miami-heat': 20,
      'orlando-magic': 26,
      'washington-wizards': 41,
      'denver-nuggets': 9,
      'minnesota-timberwolves': 22,
      'oklahoma-city-thunder': 25,
      'portland-trail-blazers': 29,
      'utah-jazz': 40,
      'golden-state-warriors': 14,
      'la-clippers': 16,
      'los-angeles-lakers': 17,
      'phoenix-suns': 28,
      'sacramento-kings': 30,
      'dallas-mavericks': 8,
      'houston-rockets': 14,
      'memphis-grizzlies': 19,
      'new-orleans-pelicans': 23,
      'san-antonio-spurs': 31,
    };
    
    // Buscar coincidencias parciales
    for (const [key, id] of Object.entries(teamIds)) {
      if (normalizedName.includes(key)) {
        return id;
      }
    }
    
    // ID por defecto si no se encuentra (logo genérico)
    return 0;
  }
  
  /**
   * Método alternativo usando otra API gratuita
   */
  getTeamBadgeUrlAlternative(teamName: string): string {
    // Normalizar el nombre del equipo
    const normalizedName = teamName.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-');
    
    // Usar API pública alternativa
    return `https://crests.football-data.org/${this.getTeamIdAlternative(normalizedName)}.svg`;
  }
  
  private getTeamIdAlternative(normalizedName: string): string {
    // Mapeo similar pero con IDs de football-data.org
    const teamIds: {[key: string]: string} = {
      'barcelona': 'FCB',
      'real-madrid': 'RMA',
      'atletico-madrid': 'ATM',
      // ... otros equipos
    };
    
    for (const [key, id] of Object.entries(teamIds)) {
      if (normalizedName.includes(key)) {
        return id;
      }
    }
    
    // ID genérico
    return 'generic';
  }
  
  /**
   * Método de respaldo usando SVG generados
   */
  getFallbackBadge(teamName: string): string {
    // Obtener iniciales del equipo
    const initials = teamName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    // Generar color basado en el nombre del equipo
    const hash = teamName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const color = `#${Math.abs(hash).toString(16).substring(0, 6).padStart(6, '0')}`;
    
    // Crear SVG data URL
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='${color.replace('#', '%23')}'/%3E%3Ctext x='20' y='25' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3E${initials}%3E%3E`;
  }

  private isNBATeam(normalizedName: string): boolean {
    const nbaTeams = [
      'celtics', 'nets', 'knicks', '76ers', 'raptors', 'bulls', 'cavaliers',
      'pistons', 'pacers', 'bucks', 'hawks', 'hornets', 'heat', 'magic',
      'wizards', 'nuggets', 'timberwolves', 'thunder', 'trail-blazers', 'jazz',
      'warriors', 'clippers', 'lakers', 'suns', 'kings', 'mavericks',
      'rockets', 'grizzlies', 'pelicans', 'spurs'
    ];
    
    return nbaTeams.some(team => normalizedName.includes(team));
  }

  private getNBATeamAbbreviation(normalizedName: string): string {
    const teamAbbreviations: { [key: string]: string } = {
      'celtics': 'bos',
      'nets': 'bkn',
      'knicks': 'ny',
      '76ers': 'phi',
      'raptors': 'tor',
      'bulls': 'chi',
      'cavaliers': 'cle',
      'pistons': 'det',
      'pacers': 'ind',
      'bucks': 'mil',
      'hawks': 'atl',
      'hornets': 'cha',
      'heat': 'mia',
      'magic': 'orl',
      'wizards': 'wsh',
      'nuggets': 'den',
      'timberwolves': 'min',
      'thunder': 'okc',
      'trail-blazers': 'por',
      'jazz': 'utah',
      'warriors': 'gs',
      'clippers': 'lac',
      'lakers': 'lal',
      'suns': 'phx',
      'kings': 'sac',
      'mavericks': 'dal',
      'rockets': 'hou',
      'grizzlies': 'mem',
      'pelicans': 'no',
      'spurs': 'sa'
    };
  
    for (const [key, abbr] of Object.entries(teamAbbreviations)) {
      if (normalizedName.includes(key)) {
        return abbr;
      }
    }
    return 'nba'; // Default fallback
  }
}