import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeamBadgeService {

  constructor() { }

  /**
   * Obtiene la URL del escudo de un equipo usando API-Football
   * @param teamName Nombre del equipo
   * @param context Contexto opcional (liga, competición)
   * @returns URL del escudo del equipo
   */
  getTeamBadgeUrl(teamName: string, context?: string): string {
    // Normalizar el nombre del equipo
    const normalizedName = teamName.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-');

    // Caso especial para St. Pauli - usar directamente la imagen local
    if (normalizedName.includes('st-pauli') || normalizedName.includes('st.pauli') ||
        normalizedName.includes('sankt-pauli') || normalizedName === 'pauli') {
      console.log('Usando imagen local para St. Pauli');
      return 'assets/teams/st-pauli.png';
    }

    // Caso especial para Paris Saint-Germain en Champions League
    if ((normalizedName.includes('paris') || normalizedName.includes('psg') ||
         normalizedName.includes('saint-germain') || normalizedName.includes('saint germain')) &&
        (context?.toLowerCase().includes('champions') || context?.toLowerCase().includes('uefa'))) {
      console.log('Usando imagen local para Paris Saint-Germain');
      return 'assets/teams/psg.png';
    }

    // Caso especial para Bodø/Glimt en Europa League
    if (normalizedName.includes('bodo') || normalizedName.includes('glimt') ||
        normalizedName.includes('bodo/glimt') || normalizedName.includes('bodø')) {
      console.log('Usando imagen local para Bodø/Glimt');
      return 'assets/teams/bodo-glimt.png';
    }

    // Caso especial para Djurgårdens IF en Conference League
    if (normalizedName.includes('djurgarden') || normalizedName.includes('djurgardens') ||
        normalizedName.includes('djurgårdens') || normalizedName.includes('djurgårdens if')) {
      console.log('Usando imagen local para Djurgårdens IF');
      return 'assets/teams/djurgardens.png';
    }

    // Caso especial para Jagiellonia Białystok en Conference League
    if (normalizedName.includes('jagiellonia') || normalizedName.includes('bialystok') ||
        normalizedName.includes('białystok') || normalizedName.includes('jagiellonia bialystok')) {
      console.log('Usando imagen local para Jagiellonia Białystok');
      return 'assets/teams/jagiellonia.png';
    }

    // Caso especial para Milan/Milano
    if (normalizedName.includes('milan') || normalizedName.includes('olimpia')) {
      // Si el contexto o nombre indica que es baloncesto (Milano), considerarlo como equipo local
      if ((context && (context.toLowerCase().includes('euroliga') ||
                      context.toLowerCase().includes('euroleague') ||
                      context.toLowerCase().includes('basket') ||
                      context.toLowerCase().includes('baloncesto'))) ||
          normalizedName.includes('milano') || normalizedName.includes('olimpia') ||
          normalizedName.includes('basket') || normalizedName.includes('baloncesto')) {
        // Change from returning boolean to returning string
        return 'assets/teams/milano-basket.png';
      }

      // Si es Inter Milan o AC Milan (fútbol), usar la API (no es local)
      if (normalizedName.includes('inter') || normalizedName === 'milan' ||
          normalizedName.includes('ac-milan')) {
        // Change from returning boolean to returning string
        const teamId = this.getTeamId(normalizedName);
        return `https://media.api-sports.io/football/teams/${teamId}.png`;
      }

      // Para otros casos con "milan", verificar en la lista
      if (this.hasLocalTeamImage(normalizedName, context)) {
        return this.getLocalTeamImageUrl(normalizedName);
      } else {
        const teamId = this.getTeamId(normalizedName);
        return `https://media.api-sports.io/football/teams/${teamId}.png`;
      }
    }

    // Caso especial para PSG/Paris
    if (normalizedName.includes('paris') || normalizedName.includes('psg')) {
      // Si el contexto o nombre indica que es baloncesto, considerarlo como equipo local
      if ((context && (context.toLowerCase().includes('euroliga') ||
                      context.toLowerCase().includes('euroleague') ||
                      context.toLowerCase().includes('basket') ||
                      context.toLowerCase().includes('baloncesto'))) ||
          (normalizedName.includes('paris') &&
           (normalizedName.includes('basket') || normalizedName.includes('baloncesto')))) {
        // Change from returning boolean to returning string
        return 'assets/teams/paris-basket.png';
      }
      // Para PSG (fútbol), usar la API (no es local)
      const teamId = this.getTeamId(normalizedName);
      return `https://media.api-sports.io/football/teams/${teamId}.png`;
    }

    // Caso especial para Bologna
    if (normalizedName.includes('bologna')) {
      // Si el contexto o nombre indica que es baloncesto, considerarlo como equipo local
      if ((context && (context.toLowerCase().includes('euroliga') ||
                      context.toLowerCase().includes('euroleague') ||
                      context.toLowerCase().includes('basket') ||
                      context.toLowerCase().includes('baloncesto'))) ||
          normalizedName.includes('virtus') ||
          normalizedName.includes('basket') ||
          normalizedName.includes('baloncesto')) {
        // Change from returning boolean to returning string
        return 'assets/teams/virtus-bologna.png';
      }
      // Para Bologna FC (fútbol), usar la API (no es local)
      const teamId = this.getTeamId(normalizedName);
      return `https://media.api-sports.io/football/teams/${teamId}.png`;
    }

    // Check if we have a local image for this team
    if (this.hasLocalTeamImage(normalizedName, context)) {
      return this.getLocalTeamImageUrl(normalizedName);
    } else {
      // Use API-Football for team badges
      const teamId = this.getTeamId(normalizedName);
      return `https://media.api-sports.io/football/teams/${teamId}.png`;
    }
  }

  /**
   * Verifica si existe una imagen local para el equipo
   * @param normalizedName Nombre normalizado del equipo
   * @returns true si existe una imagen local
   */
  private hasLocalTeamImage(normalizedName: string, context?: string): boolean {
    // Lista de equipos con imágenes locales
    const localTeams = [
      // Euroliga (baloncesto)
      'asvel-lyon', 'zalgiris', 'monaco-basket', 'milano',
      'partizan', 'anadolu', 'maccabi',
      'baskonia', 'alba', 'virtus-bologna', 'paris-basket',

      // Bundesliga
      'st-pauli', 'fc-st-pauli', 'sankt-pauli',

      // Champions League
      'paris-saint-germain', 'psg', 'paris',

      // Europa League
      'bodo-glimt', 'bodø-glimt', 'bodo/glimt', 'bodø/glimt',

      // Conference League
      'djurgardens', 'djurgårdens', 'djurgarden', 'djurgården',
      'jagiellonia', 'bialystok', 'białystok', 'jagiellonia-bialystok', 'jagiellonia-białystok',

      // Serie A
      'como',

      // La Liga
      'osasuna', 'leganes', 'las-palmas',

      // Conference League
      'legia', 'djugardens', 'rapid-wien', 'celje', 'jagielonia',

      // Europa League
      'bodo-glimt'
    ];

    // Caso especial para Bayern Munich - siempre usar la API
    if (normalizedName.includes('bayern') || normalizedName.includes('munich')) {
      return false; // Nunca usar imagen local para Bayern Munich
    }

    // Caso especial para Milan/Milano
    if (normalizedName.includes('milan') || normalizedName.includes('olimpia')) {
      // Si el contexto o nombre indica que es baloncesto (Milano), considerarlo como equipo local
      if ((context && (context.toLowerCase().includes('euroliga') ||
                      context.toLowerCase().includes('euroleague') ||
                      context.toLowerCase().includes('basket') ||
                      context.toLowerCase().includes('baloncesto'))) ||
          normalizedName.includes('milano') || normalizedName.includes('olimpia') ||
          normalizedName.includes('basket') || normalizedName.includes('baloncesto')) {
        return true;
      }

      // Si es Inter Milan o AC Milan (fútbol), usar la API (no es local)
      if (normalizedName.includes('inter') || normalizedName === 'milan' ||
          normalizedName.includes('ac-milan')) {
        return false;
      }

      // Para otros casos con "milan", verificar en la lista
      return localTeams.some(team =>
        normalizedName === team ||
        normalizedName.includes(team) ||
        team.includes(normalizedName)
      );
    }

    // Caso especial para PSG/Paris
    if (normalizedName.includes('paris') || normalizedName.includes('psg')) {
      // Si el contexto o nombre indica que es baloncesto, considerarlo como equipo local
      if ((context && (context.toLowerCase().includes('euroliga') ||
                      context.toLowerCase().includes('euroleague') ||
                      context.toLowerCase().includes('basket') ||
                      context.toLowerCase().includes('baloncesto'))) ||
          (normalizedName.includes('paris') &&
           (normalizedName.includes('basket') || normalizedName.includes('baloncesto')))) {
        return true;
      }
      // Para PSG (fútbol), usar la API (no es local)
      return false;
    }

    // Caso especial para Bologna
    if (normalizedName.includes('bologna')) {
      // Si el contexto o nombre indica que es baloncesto, considerarlo como equipo local
      if ((context && (context.toLowerCase().includes('euroliga') ||
                      context.toLowerCase().includes('euroleague') ||
                      context.toLowerCase().includes('basket') ||
                      context.toLowerCase().includes('baloncesto'))) ||
          normalizedName.includes('virtus') ||
          normalizedName.includes('basket') ||
          normalizedName.includes('baloncesto')) {
        return true;
      }
      // Para Bologna FC (fútbol), usar la API (no es local)
      return false;
    }

    // The issue is likely here - you're returning a boolean where a string is expected
    // or vice versa. Let's fix it:

    // Check if the team is in the localTeams array
    return localTeams.some(team => normalizedName.includes(team));
  }

  /**
   * Obtiene la URL de la imagen local del equipo
   * @param normalizedName Nombre normalizado del equipo
   * @returns URL de la imagen local
   */
  private getLocalTeamImageUrl(normalizedName: string): string {
    // Mapeo de nombres normalizados a nombres de archivo
    const fileNames: {[key: string]: string} = {
      // Euroliga (baloncesto)
      'asvel-lyon': 'asvel-lyon.png',
      'zalgiris': 'zalgiris.png',
      'monaco-basket': 'monaco-basket.png',
      'milano': 'milano.png',
      'milano-basket': 'milano.png',
      'partizan': 'partizan.png',
      'anadolu': 'anadolu-efes.png',
      'maccabi': 'maccabi.png',
      'baskonia': 'baskonia.png',
      'alba': 'alba-berlin.png',
      'virtus-bologna': 'virtus-bologna.png',
      'bologna-basket': 'virtus-bologna.png',
      'paris-basket': 'paris-basket.png',
      'paris': 'paris-basket.png',

      // Bundesliga
      'st-pauli': 'st-pauli.png',

      // Serie A
      'como': 'como.png',

      // La Liga
      'osasuna': 'osasuna.png',
      'leganes': 'leganes.png',
      'las-palmas': 'las-palmas.png',

      // Conference League
      'legia': 'legia-warsaw.png',
      'djugardens': 'djugardens.png',
      'rapid-wien': 'rapid-wien.png',
      'celje': 'celje.png',
      'jagielonia': 'jagielonia.png',

      // Europa League
      'bodo-glimt': 'bodo-glimt.png'
    };

    // Caso especial para Bayern Munich (baloncesto)
    if ((normalizedName.includes('bayern') || normalizedName.includes('munich')) &&
        (normalizedName.includes('basket') || normalizedName.includes('baloncesto') ||
         normalizedName.includes('euroliga') || normalizedName.includes('euroleague'))) {
      return 'assets/teams/bayern-munich-basket.png';
    }

    // Caso especial para Milano (baloncesto)
    // Caso especial para Milano (baloncesto)
    if ((normalizedName.includes('milan') || normalizedName.includes('olimpia')) &&
        (normalizedName.includes('milano') || normalizedName.includes('olimpia') ||
         normalizedName.includes('basket') || normalizedName.includes('baloncesto') ||
         normalizedName.includes('euroliga') || normalizedName.includes('euroleague'))) {
      return 'assets/teams/milano-basket.png';
    }

    // Caso especial para Paris (baloncesto)
    if ((normalizedName.includes('paris') || normalizedName.includes('psg')) &&
        (normalizedName.includes('basket') || normalizedName.includes('baloncesto') ||
         normalizedName.includes('euroliga') || normalizedName.includes('euroleague'))) {
      return 'assets/teams/paris-basket.png';
    }

    // Caso especial para Virtus Bologna (baloncesto)
    if (normalizedName.includes('bologna') &&
        (normalizedName.includes('virtus') || normalizedName.includes('basket') ||
         normalizedName.includes('baloncesto') || normalizedName.includes('euroliga') ||
         normalizedName.includes('euroleague'))) {
      return 'assets/teams/virtus-bologna.png';
    }

    // Buscar coincidencias exactas primero
    if (fileNames[normalizedName]) {
      return `assets/teams/${fileNames[normalizedName]}`;
    }

    // Si no hay coincidencia exacta, buscar coincidencias parciales
    for (const [key, fileName] of Object.entries(fileNames)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return `assets/teams/${fileName}`;
      }
    }

    // Si no se encuentra coincidencia, usar una imagen genérica
    return 'assets/teams/default.png';
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
      // 'osasuna': 558, // Removed as requested
      'rayo-vallecano': 728,
      'valladolid': 720,
      'girona': 547,
      'alaves': 542,
      // 'las-palmas': 472, // Removed as requested
      'granada': 715,
      'almeria': 723,
      'cadiz': 724,
      // 'leganes': 726, // Removed as requested

      // Premier League (Inglaterra)
      'manchester-city': 50,
      'manchester-united': 33,
      'liverpool': 40,
      'chelsea': 49,
      'arsenal': 42,
      'tottenham': 47,
      'west-ham': 48,
      'leicester': 46,
      'everton': 45,
      'aston-villa': 66,
      'newcastle': 34,
      'wolves': 39,
      'crystal-palace': 52,
      'southampton': 41,
      'brighton': 51,
      'brentford': 55,
      'leeds': 63,
      'burnley': 44,
      'watford': 38,
      'norwich': 71,
      'fulham': 36,
      'bournemouth': 35,
      'nottingham-forest': 65,
      'sheffield-united': 62,
      'luton-town': 1359,
      'ipswich-town': 677,

      // Serie A (Italia)
      'juventus': 496,
      'inter': 505,
      'milan': 489,
      'napoli': 492,
      'roma': 497,
      'lazio': 487,
      'atalanta': 499,
      'fiorentina': 502,
      'torino': 503,
      'sassuolo': 488,
      'verona': 504,
      'bologna': 500,
      'empoli': 511,
      'sampdoria': 498,
      'udinese': 494,
      'venezia': 517,
      'cagliari': 490,
      'spezia': 515,
      'salernitana': 514,
      'cremonese': 520,
      'monza': 1579,
      'lecce': 867,
      'genoa': 495,
      // 'como': 522, // Removed as requested
      'parma': 523,

      // Bundesliga (Alemania)
      'bayern-munich': 157,
      'borussia-dortmund': 165,
      'rb-leipzig': 173,
      'bayer-leverkusen': 168,
      'wolfsburg': 161,
      'eintracht-frankfurt': 169,
      'borussia-monchengladbach': 163,
      'hoffenheim': 167,
      'stuttgart': 172,
      'freiburg': 160,
      'mainz': 164,
      'koln': 192,
      'union-berlin': 182,
      'hertha-berlin': 159,
      'augsburg': 170,
      'arminia-bielefeld': 188,
      'bochum': 176,
      'greuther-furth': 178,
      'werder-bremen': 162,
      'schalke': 174,
      'holstein-kiel': 175,
      'heidenheim': 180,
      // 'st-pauli': 189, // Removed as requested

      // Champions League y Europa League
      // 'psg': 85, // Removed as requested
      // 'manchester-city': 50, // Removed duplicate
      // 'real-madrid': 541, // Removed duplicate
      // 'bayern-munich': 157, // Removed as requested
      // 'liverpool': 40, // Removed duplicate
      // 'barcelona': 529, // Removed duplicate
      // 'juventus': 496, // Removed duplicate
      // 'atletico-madrid': 530, // Removed duplicate
      // 'chelsea': 49, // Removed duplicate
      // 'borussia-dortmund': 165, // Removed duplicate
      'porto': 212,
      'ajax': 194,
      'benfica': 211,
      // 'rb-leipzig': 173, // Removed duplicate
      // 'atalanta': 499, // Removed duplicate
      // 'sevilla': 536, // Removed duplicate
      // 'inter': 505, // Removed duplicate
      // 'napoli': 492, // Removed duplicate
      // 'milan': 489, // Removed duplicate
      // 'arsenal': 42, // Removed duplicate
      // 'tottenham': 47, // Removed duplicate
      // 'roma': 497, // Removed duplicate
      // 'lazio': 487, // Removed duplicate
      // 'villarreal': 533, // Removed duplicate
      'salzburg': 571,
      'shakhtar-donetsk': 550,
      'zenit': 596,
      'lille': 79,
      'sporting-cp': 228,
      'club-brugge': 569,
      'dinamo-zagreb': 620,
      'young-boys': 565,
      'malmo-ff': 576,
      'sheriff-tiraspol': 568,
      'besiktas': 645,
      'dynamo-kyiv': 597,
      'psv': 197,
      'feyenoord': 196,
      'rangers': 257,
      'celtic': 247,
      'olympiacos': 553,
      'crvena-zvezda': 598,
      'slavia-prague': 567,
      'sparta-prague': 593,
      'midtjylland': 583,
      // 'bodo-glimt': 710, // Removed as requested
      'galatasaray': 645,
      'fenerbahce': 611,
      'monaco': 91,
      'lyon': 80,
      'marseille': 81,
      'rennes': 94,
      'nice': 84,
      'lens': 116,
      'strasbourg': 95,
      'nantes': 83,
      'reims': 93,
      'montpellier': 82,
      'angers': 77,
      'brest': 106,
      'troyes': 110,
      'lorient': 97,
      'clermont-foot': 99,
      'metz': 112,
      'saint-etienne': 1063,
      'bordeaux': 78,
      'auxerre': 96,
      'toulouse': 101, // Fixed duplicate - changed ID from 96 to 101
      'ajaccio': 98,

      // Equipos adicionales de otras ligas
      // 'ajax': 194, // Removed duplicate
      // 'psv': 197, // Removed duplicate
      // 'feyenoord': 196, // Removed duplicate
      'az-alkmaar': 195,
      // 'porto': 212, // Removed duplicate
      // 'benfica': 211, // Removed duplicate
      // 'sporting-cp': 228, // Removed duplicate
      'braga': 214,
      // 'celtic': 247, // Removed duplicate
      // 'rangers': 257, // Removed duplicate
      'aberdeen': 258,
      'hearts': 260,
      'anderlecht': 554,
      // 'club-brugge': 569, // Removed duplicate
      'gent': 631,
      'standard-liege': 733,
      // 'olympiacos': 553, // Removed duplicate
      'panathinaikos': 617,
      'aek-athens': 557,
      'paok': 619,
      // 'galatasaray': 645, // Removed duplicate
      // 'fenerbahce': 611, // Removed duplicate
      // 'besiktas': 645, // Removed duplicate - this is a duplicate with galatasaray
      'besiktas-istanbul': 571, // Added with different key
      'trabzonspor': 610,
      'basel': 555,
      // 'young-boys': 565, // Removed duplicate
      'zurich': 556,
      'lugano': 605,
      // 'slavia-prague': 567, // Removed duplicate
      // 'sparta-prague': 593, // Removed duplicate
      'viktoria-plzen': 566,
      // 'legia-warsaw': 543, // Removed as requested
      'lech-poznan': 572,
      // 'dinamo-zagreb': 620, // Removed duplicate
      'hajduk-split': 621,
      'rijeka': 628,
      'red-bull-salzburg': 571,
      // 'rapid-wien': 574, // Removed as requested
      'sturm-graz': 578,
      'austria-wien': 600,
      // 'shakhtar-donetsk': 550, // Removed duplicate
      // 'dynamo-kyiv': 597, // Removed duplicate
      // 'zenit': 596, // Removed duplicate
      'spartak-moscow': 558,
      'cska-moscow': 611, // Changed ID to avoid duplicate
      'lokomotiv-moscow': 599, // Changed ID to avoid duplicate
      'krasnodar': 627,
      'rostov': 628,
      'boca-juniors': 451,
      'river-plate': 452,
      'flamengo': 127,
      'palmeiras': 128,
      'santos': 135,
      'sao-paulo': 131,
      'corinthians': 133,
      'gremio': 130,
      'internacional': 129,
      'atletico-mineiro': 134,
      'america': 2283,
      'cruz-azul': 2284,
      'guadalajara': 2285,
      'monterrey': 2287,
      'tigres': 2290,
      'pumas-unam': 2288,
      'al-hilal': 2932,
      'al-nassr': 2931,
      'al-ahli': 2933,
      'al-ittihad': 2934,
      'al-shabab': 2935,
      'guangzhou-evergrande': 3300,
      'shanghai-sipg': 3301,
      'beijing-guoan': 3302,
      'jiangsu-suning': 3303,
      'shandong-luneng': 3304,
      'kashima-antlers': 3350,
      'urawa-red-diamonds': 3351,
      'kawasaki-frontale': 3352,
      'gamba-osaka': 3353,
      'vissel-kobe': 3354,
      'sydney-fc': 3400,
      'melbourne-victory': 3401,
      'melbourne-city': 3402,
      'adelaide-united': 3403,
      'western-sydney': 3404,
      'los-angeles-fc': 2581,
      'la-galaxy': 2582,
      'seattle-sounders': 2583,
      'toronto-fc': 2584,
      'atlanta-united': 2585,
      'new-york-city': 2586,
      'new-york-red-bulls': 2587,
      'portland-timbers': 2588,
      'inter-miami': 2589,
      'orlando-city': 2590,
      'dc-united': 2591,
      'chicago-fire': 2592,
      'columbus-crew': 2593,
      'philadelphia-union': 2594,
      'fc-cincinnati': 2595,
      'minnesota-united': 2596,
      'nashville-sc': 2597,
      'austin-fc': 2598,
      'charlotte-fc': 2599,
      'st-louis-city': 2600
  };

  // Buscar coincidencias exactas primero
  if (teamIds[normalizedName]) {
    return teamIds[normalizedName];
  }

  // Si no hay coincidencia exacta, buscar coincidencias parciales
  for (const team in teamIds) {
    if (normalizedName.includes(team) || team.includes(normalizedName)) {
      return teamIds[team];
    }
  }

  return 0; // No se encontró coincidencia
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
  /**
   * Proporciona un escudo genérico basado en el nombre del equipo
   * @param teamName Nombre del equipo
   * @returns URL de un escudo genérico
   */
  getFallbackBadge(teamName: string): string {
    // Primero intentamos con un servicio alternativo para equipos de fútbol
    if (!this.isNBATeam(teamName.toLowerCase()) && !this.isMLBTeam(teamName.toLowerCase())) {
      // Intentar con el servicio de Football Data
      const normalizedName = teamName.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-');

      // Intentar con PES Database (alternativa para equipos de fútbol)
      return `https://www.pesmaster.com/pes-2023/graphics/teamlogos/${normalizedName}.png`;
    }

    // Si no es un equipo de fútbol o no se encuentra, usar un escudo genérico
    const firstLetter = teamName.charAt(0).toUpperCase();
    const color = this.getColorFromName(teamName);

    // Generar un SVG con la inicial del equipo
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="${color}" /><text x="50" y="65" font-family="Arial" font-size="50" font-weight="bold" text-anchor="middle" fill="white">${firstLetter}</text></svg>`;
  }

  /**
   * Genera un color basado en el nombre del equipo
   * @param name Nombre del equipo
   * @returns Código de color hexadecimal para usar en SVG
   */
  private getColorFromName(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      '%2334495e', '%232980b9', '%239b59b6', '%2316a085',
      '%23c0392b', '%23f39c12', '%23d35400', '%23192a56',
      '%23273c75', '%236c5ce7', '%23e84118', '%230097e6'
    ];

    // Usar el hash para seleccionar un color de la lista
    const index = Math.abs(hash) % colors.length;
    return colors[index];
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
      'hornets': 'cha', // Aseguramos que sea 'cha' para Charlotte Hornets
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

    // Add additional mappings for more flexible matching
    const additionalMappings: { [key: string]: string } = {
      'charlotte': 'cha', // Aseguramos que Charlotte siempre sea 'cha'
      'charlotte-hornets': 'cha', // Añadimos esta entrada explícita
      'brooklyn': 'bkn',
      'brooklyn-nets': 'bkn', // Añadimos esta entrada para Brooklyn Nets
      'new-york': 'ny',
      'toronto': 'tor',
      'chicago': 'chi',
      'cleveland': 'cle',
      'detroit': 'det',
      'indiana': 'ind',
      'milwaukee': 'mil',
      'atlanta': 'atl',
      'miami': 'mia',
      'orlando': 'orl',
      'washington': 'wsh',
      'denver': 'den',
      'minnesota': 'min',
      'oklahoma': 'okc',
      'portland': 'por',
      'utah': 'utah',
      'golden-state': 'gs',
      'los-angeles-clippers': 'lac',
      'los-angeles-lakers': 'lal',
      'phoenix': 'phx',
      'sacramento': 'sac',
      'dallas': 'dal',
      'houston': 'hou',
      'memphis': 'mem',
      'new-orleans': 'no',
      'san-antonio': 'sa'
    };

    // Primero verificamos si el nombre contiene explícitamente "charlotte" o "hornets"
    if (normalizedName.includes('charlotte') || normalizedName.includes('hornets')) {
      return 'cha';
    }

    // Verificamos si el nombre contiene explícitamente "brooklyn" o "nets"
    if (normalizedName.includes('brooklyn') ||
        (normalizedName.includes('nets') && !normalizedName.includes('pelicans'))) {
      return 'bkn';
    }

    // First check the main abbreviations
    for (const [key, abbr] of Object.entries(teamAbbreviations)) {
      if (normalizedName.includes(key)) {
        return abbr;
      }
    }

    // Then check additional mappings
    for (const [key, abbr] of Object.entries(additionalMappings)) {
      if (normalizedName.includes(key)) {
        return abbr;
      }
    }

    return 'nba'; // Default fallback
  }

  private isTennisPlayer(name: string): boolean {
    // This is a simple check - you might want to improve it
    // with a more comprehensive list of tennis players
    const tennisPlayers = [
      'Alcaraz', 'Sinner', 'Djokovic', 'Medvedev', 'Zverev',
      'Rublev', 'Hurkacz', 'Ruud', 'De Minaur', 'Tsitsipas',
      'Fritz', 'Paul', 'Tiafoe', 'Shelton', 'Dimitrov'
    ];

    return tennisPlayers.some(player => name.includes(player));
  }

  private getTennisPlayerImage(playerName: string): string {
    // Normalize the player name
    const normalized = playerName.toLowerCase().replace(/\s+/g, '-');

    // Try to return a player-specific image, or fall back to a generic tennis player silhouette
    return `assets/players/${normalized}.png` || 'assets/players/generic-tennis-player.png';
  }

  // Add these new methods for MLB teams
  private isMLBTeam(normalizedName: string): boolean {
    const mlbTeams = [
      'new-york-yankees', 'boston-red-sox', 'toronto-blue-jays', 'baltimore-orioles', 'tampa-bay-rays',
      'chicago-white-sox', 'cleveland-guardians', 'detroit-tigers', 'kansas-city-royals', 'minnesota-twins',
      'houston-astros', 'los-angeles-angels', 'oakland-athletics', 'seattle-mariners', 'texas-rangers',
      'atlanta-braves', 'miami-marlins', 'new-york-mets', 'philadelphia-phillies', 'washington-nationals',
      'chicago-cubs', 'cincinnati-reds', 'milwaukee-brewers', 'pittsburgh-pirates', 'st-louis-cardinals',
      'arizona-diamondbacks', 'colorado-rockies', 'los-angeles-dodgers', 'san-diego-padres', 'san-francisco-giants'
    ];

    return mlbTeams.includes(normalizedName);
  }

  private getMLBTeamAbbreviation(normalizedName: string): string {
    const mlbTeamAbbreviations: {[key: string]: string} = {
      'new-york-yankees': 'nyy', 'boston-red-sox': 'bos', 'toronto-blue-jays': 'tor', 'baltimore-orioles': 'bal', 'tampa-bay-rays': 'tb',
      'chicago-white-sox': 'chw', 'cleveland-guardians': 'cle', 'detroit-tigers': 'det', 'kansas-city-royals': 'kc', 'minnesota-twins': 'min',
      'houston-astros': 'hou', 'los-angeles-angels': 'laa', 'oakland-athletics': 'oak', 'seattle-mariners': 'sea', 'texas-rangers': 'tex',
      'atlanta-braves': 'atl', 'miami-marlins': 'mia', 'new-york-mets': 'nym', 'philadelphia-phillies': 'phi', 'washington-nationals': 'wsh',
      'chicago-cubs': 'chc', 'cincinnati-reds': 'cin', 'milwaukee-brewers': 'mil', 'pittsburgh-pirates': 'pit', 'st-louis-cardinals': 'stl',
      'arizona-diamondbacks': 'ari', 'colorado-rockies': 'col', 'los-angeles-dodgers': 'lad', 'san-diego-padres': 'sd', 'san-francisco-giants': 'sf'
    };

    return mlbTeamAbbreviations[normalizedName] || 'mlb';
  }
}
