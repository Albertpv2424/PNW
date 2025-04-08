import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-language-slider',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './language-slider.component.html',
  styleUrls: ['./language-slider.component.css']
})
export class LanguageSliderComponent implements OnInit {
  languages: { code: string, name: string }[] = [];
  currentLang: string = 'es';
  isExpanded: boolean = false;

  constructor(
    private languageService: LanguageService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.languages = this.languageService.getAvailableLanguages();
    this.languageService.currentLang.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  toggleExpanded(event: Event): void {
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Cerrar el panel si se hace clic fuera del componente
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isExpanded = false;
    }
  }

  setLanguage(langCode: string): void {
    this.languageService.setLanguage(langCode);
    this.isExpanded = false; // Colapsar después de seleccionar
  }

  getCurrentLanguageName(): string {
    const lang = this.languages.find(l => l.code === this.currentLang);
    return lang ? lang.name : 'Español';
  }

  getFlagUrl(langCode: string): string {
    // Map language codes to country codes for flags
    const countryMap: {[key: string]: string} = {
      'es': 'es',
      'en': 'gb', // Make sure this is 'gb' for Great Britain
      'it': 'it',
      'ca': 'catalonia' // Usando la bandera catalana específica
    };

    const countryCode = countryMap[langCode] || langCode;

    // Caso especial para Cataluña
    if (countryCode === 'catalonia') {
      // Usar una imagen estática de la bandera catalana desde assets
      return 'assets/flags/catalonia.png';
    }

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
      'ca': '🏴', // Emoji simple para Cataluña
    };

    return flagMap[langCode] || '🌐';
  }
}
