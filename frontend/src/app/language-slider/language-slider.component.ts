import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-slider',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="language-slider">
      <div class="slider-container">
        <div class="slider-track">
          <div 
            *ngFor="let lang of languages" 
            class="slider-item" 
            [class.active]="lang.code === currentLang"
            (click)="setLanguage(lang.code)">
            <div class="lang-flag">
              <img [src]="getFlagUrl(lang.code)" [alt]="lang.name" (error)="handleFlagError($event)">
            </div>
            <div class="lang-name">{{ lang.name }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .language-slider {
      display: inline-block;
      margin-left: 5px; /* Reducido de 15px a 5px */
    }
    
    .slider-container {
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 20px;
      padding: 5px;
      border: 1px solid #00b341;
      overflow-x: auto;
      max-width: 250px; /* Aumentado de 200px a 250px */
    }
    
    .slider-track {
      display: flex;
      gap: 5px; /* Reducido de 10px a 5px */
    }
    
    .slider-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 5px 8px; /* Reducido de 5px 10px a 5px 8px */
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 35px; /* Reducido de 40px a 35px */
      text-align: center;
    }
    
    .slider-item:hover {
      background-color: rgba(0, 179, 65, 0.2);
    }
    
    .slider-item.active {
      background-color: #00b341;
    }
    
    .lang-flag {
      margin-bottom: 2px;
      width: 24px;
      height: 18px;
      overflow: hidden;
      border-radius: 2px;
    }
    
    .lang-flag img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .lang-name {
      font-size: 12px;
      color: white;
    }

    /* Hide scrollbar but keep functionality */
    .slider-container::-webkit-scrollbar {
      height: 0;
      width: 0;
    }
  `]
})
export class LanguageSliderComponent implements OnInit {
  languages: { code: string, name: string }[] = [];
  currentLang: string = 'es';

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languages = this.languageService.getAvailableLanguages();
    this.languageService.currentLang.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  setLanguage(langCode: string): void {
    this.languageService.setLanguage(langCode);
  }

  getFlagUrl(langCode: string): string {
    // Map language codes to country codes for flags
    const countryMap: {[key: string]: string} = {
      'es': 'es',
      'en': 'gb', // Make sure this is 'gb' for Great Britain
      'it': 'it',
      'ca': 'es', // Using Spain flag for Catalan
    };
    
    const countryCode = countryMap[langCode] || langCode;
    // Use a more reliable flag CDN with HTTPS
    return `https://flagcdn.com/w40/${countryCode}.png`;
  }

  handleFlagError(event: any): void {
    console.error('Error loading flag image for language');
    // Fallback to emoji flags if image fails to load
    const img = event.target;
    const langCode = img.alt.toLowerCase();
    
    // Create a span with emoji flag as fallback
    const parent = img.parentNode;
    const span = document.createElement('span');
    span.textContent = this.getFlagEmoji(langCode);
    span.style.fontSize = '18px';
    
    // Replace the img with the span
    parent.replaceChild(span, img);
  }

  getFlagEmoji(langCode: string): string {
    // Map language codes to flag emojis as fallback
    const flagMap: {[key: string]: string} = {
      'es': '🇪🇸',
      'en': '🇬🇧',
      'it': '🇮🇹',
      'ca': '🇪🇸',
    };
    
    return flagMap[langCode] || '🌐';
  }
}
