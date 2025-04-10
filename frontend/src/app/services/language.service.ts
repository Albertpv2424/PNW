import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  getLanguageName(currentLang: string): string {
    throw new Error('Method not implemented.');
  }
  // Default language
  private defaultLang = 'es';
  
  // Available languages - All supported languages
  private languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'it', name: 'Italiano' },
    { code: 'ca', name: 'Català' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' }
  ];
  
  // Current language subject
  private langSubject = new BehaviorSubject<string>(this.defaultLang);
  
  // Observable for current language
  currentLang = this.langSubject.asObservable();

  constructor(private translate: TranslateService) {
    // Initialize the translation service
    this.translate.setDefaultLang(this.defaultLang);
    
    // Try to get language from localStorage
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && this.isValidLanguage(savedLang)) {
      this.setLanguage(savedLang);
    } else {
      this.setLanguage(this.defaultLang);
    }
  }

  /**
   * Set the current language
   * @param lang Language code
   */
  setLanguage(lang: string): void {
    if (this.isValidLanguage(lang)) {
      this.translate.use(lang);
      localStorage.setItem('preferredLanguage', lang);
      this.langSubject.next(lang);
      document.documentElement.lang = lang;
    }
  }

  /**
   * Get available languages
   * @returns Array of language objects
   */
  getAvailableLanguages(): { code: string, name: string }[] {
    return [...this.languages];
  }

  /**
   * Check if a language code is valid
   * @param lang Language code to check
   * @returns True if valid
   */
  private isValidLanguage(lang: string): boolean {
    return this.languages.some(l => l.code === lang);
  }
}