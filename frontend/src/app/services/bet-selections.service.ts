import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface BetSelection {
  matchId: string;
  teamName: string;
  betType: string;
  odds: number;
  matchInfo: string;
  homeTeam?: string;
  awayTeam?: string;
  leagueName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BetSelectionsService {
  private selections: BetSelection[] = [];
  private selectionsSubject = new BehaviorSubject<BetSelection[]>([]);

  getSelections() {
    return this.selectionsSubject.asObservable();
  }

  addSelection(selection: BetSelection) {
    // Evitar duplicados del mismo partido
    const existingIndex = this.selections.findIndex(s => s.matchId === selection.matchId);
    if (existingIndex !== -1) {
      this.selections[existingIndex] = selection;
    } else {
      this.selections.push(selection);
    }
    this.selectionsSubject.next([...this.selections]);
  }

  removeSelection(matchId: string, teamName: string): void {
    // Find the index of the selection to remove
    const index = this.selections.findIndex(s => 
      s.matchId === matchId && 
      (s.teamName === teamName || 
       (teamName === 'Draw' && s.teamName === 'Empate') ||
       (s.teamName === 'Visitante' && teamName === s.teamName))
    );
    
    // If found, remove it
    if (index !== -1) {
      this.selections.splice(index, 1);
      this.selectionsSubject.next([...this.selections]);
      console.log('Selection removed:', matchId, teamName);
    }
  }

  clearSelections() {
    this.selections = [];
    this.selectionsSubject.next([]);
  }

  calculateTotalOdds(): number {
    return this.selections.reduce((total, selection) => total * selection.odds, 1);
  }

  // Añadir este método para obtener las selecciones actuales
  getCurrentSelections(): BetSelection[] {
    return [...this.selections];
  }
}