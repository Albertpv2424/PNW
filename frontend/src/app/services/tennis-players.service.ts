import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TennisPlayersService {
  private topPlayers: { [key: string]: string } = {
    // Current top 30 ATP players
    'Jannik Sinner': 'sinner.png',
    'Novak Djokovic': 'djokovic.png',
    'Carlos Alcaraz': 'alcaraz.png',
    'Alexander Zverev': 'zverev.png',
    'Daniil Medvedev': 'medvedev.png',
    'Andrey Rublev': 'rublev.png',
    'Hubert Hurkacz': 'hurkacz.png',
    'Casper Ruud': 'ruud.png',
    'Grigor Dimitrov': 'dimitrov.png',
    'Alex de Minaur': 'deminaur.png',
    'Taylor Fritz': 'fritz.png',
    'Stefanos Tsitsipas': 'tsitsipas.png',
    'Tommy Paul': 'paul.png',
    'Ben Shelton': 'shelton.png',
    'Frances Tiafoe': 'tiafoe.png',
    'Lorenzo Musetti': 'musetti.png',
    'Felix Auger-Aliassime': 'auger-aliassime.png',
    'Karen Khachanov': 'khachanov.png',
    'Sebastian Korda': 'korda.png',
    'Nicolas Jarry': 'jarry.png',
    'Holger Rune': 'rune.png',
    'Ugo Humbert': 'humbert.png',
    'Sebastian Baez': 'baez.png',
    'Arthur Fils': 'fils.png',
    'Alejandro Tabilo': 'tabilo.png',
    'Alexander Bublik': 'bublik.png',
    'Jack Draper': 'draper.png',
    'Tallon Griekspoor': 'griekspoor.png',
    'Adrian Mannarino': 'mannarino.png',
    'Tomas Martin Etcheverry': 'etcheverry.png',
    
    // Add variations of names that might come from the API
    'J. Sinner': 'sinner.png',
    'N. Djokovic': 'djokovic.png',
    'C. Alcaraz': 'alcaraz.png',
    'A. Zverev': 'zverev.png',
    'D. Medvedev': 'medvedev.png',
    'A. Rublev': 'rublev.png',
    'H. Hurkacz': 'hurkacz.png',
    'C. Ruud': 'ruud.png',
    'G. Dimitrov': 'dimitrov.png',
    'A. de Minaur': 'deminaur.png',
    'T. Fritz': 'fritz.png',
    'S. Tsitsipas': 'tsitsipas.png',
    'T. Paul': 'paul.png',
    'B. Shelton': 'shelton.png',
    'F. Tiafoe': 'tiafoe.png',
    'L. Musetti': 'musetti.png',
    'F. Auger-Aliassime': 'auger-aliassime.png',
    'K. Khachanov': 'khachanov.png',
    'S. Korda': 'korda.png',
    'N. Jarry': 'jarry.png',
    'H. Rune': 'rune.png',
    'U. Humbert': 'humbert.png',
    'S. Baez': 'baez.png',
    'A. Fils': 'fils.png',
    'A. Tabilo': 'tabilo.png',
    'A. Bublik': 'bublik.png',
    'J. Draper': 'draper.png',
    'T. Griekspoor': 'griekspoor.png',
    'A. Mannarino': 'mannarino.png',
    'T. Etcheverry': 'etcheverry.png',
    
    // Add common name variations seen in your screenshot
    'Francisco Cerundolo': 'cerundolo.png',
    'F. Cerundolo': 'cerundolo.png',
    'Matteo Berrettini': 'berrettini.png',
    'M. Berrettini': 'berrettini.png',
    'Adam Walton': 'walton.png',
    'A. Walton': 'walton.png',
    'Jakub Mensik': 'mensik.png',
    'J. Mensik': 'mensik.png'
  };

  // Almacena las imágenes que ya sabemos que faltan para evitar múltiples errores
  private missingImages: Set<string> = new Set<string>();

  constructor() { }

  getPlayerImagePath(playerName: string): string {
    // Si ya sabemos que la imagen falta, devolver directamente la imagen por defecto
    if (this.missingImages.has(playerName)) {
      return 'assets/players/default.png';
    }

    // First try direct match
    if (this.topPlayers[playerName]) {
      return `assets/players/${this.topPlayers[playerName]}`;
    }
    
    // If no direct match, try to find a partial match
    const normalizedName = playerName.toLowerCase();
    for (const [key, value] of Object.entries(this.topPlayers)) {
      if (normalizedName.includes(key.toLowerCase()) || 
          key.toLowerCase().includes(normalizedName)) {
        return `assets/players/${value}`;
      }
    }
    
    // Si llegamos aquí, no hay coincidencia, registrar como faltante
    this.missingImages.add(playerName);
    console.log(`No image mapping found for player: ${playerName}`);
    return 'assets/players/default.png';
  }

  hasCustomImage(playerName: string): boolean {
    // Si ya sabemos que falta, devolver false directamente
    if (this.missingImages.has(playerName)) {
      return false;
    }

    // Check for direct match
    if (this.topPlayers[playerName]) {
      return true;
    }
    
    // Check for partial match
    const normalizedName = playerName.toLowerCase();
    for (const key of Object.keys(this.topPlayers)) {
      if (normalizedName.includes(key.toLowerCase()) || 
          key.toLowerCase().includes(normalizedName)) {
        return true;
      }
    }
    
    // Si llegamos aquí, no hay coincidencia
    this.missingImages.add(playerName);
    return false;
  }

  // Método para manejar errores de carga de imágenes
  // Add this method to the TennisPlayersService class if it doesn't exist
  handleImageError(playerName: string): void {
    console.warn(`Error loading image for player: ${playerName}`);
    this.missingImages.add(playerName);
  }
}