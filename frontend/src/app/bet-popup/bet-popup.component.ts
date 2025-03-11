import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bet-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bet-popup.component.html',
  styleUrls: ['./bet-popup.component.css']
})
export class BetPopupComponent {
  @Input() teamName: string = '';
  @Input() betType: string = '';
  @Input() odds: number = 0;
  @Input() visible: boolean = false;
  @Input() matchInfo: string = ''; // Nueva propiedad para mostrar la información del partido
  @Output() close = new EventEmitter<void>();
  @Output() placeBet = new EventEmitter<{amount: number, odds: number}>();
  
  betAmount: number = 10; // Valor predeterminado
  
  closePopup() {
    this.close.emit();
  }
  
  submitBet() {
    if (this.betAmount > 0) {
      this.placeBet.emit({
        amount: this.betAmount,
        odds: this.odds
      });
      this.closePopup();
    }
  }
}