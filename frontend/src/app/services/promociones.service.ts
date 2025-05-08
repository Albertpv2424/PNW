import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  private apiUrl = environment.apiUrl;
  private currentLang = 'es';
  
  // BehaviorSubject para almacenar y emitir datos de promociones
  private promocionesSubject = new BehaviorSubject<any[]>([]);
  
  // Observable al que los componentes pueden suscribirse
  promociones$ = this.promocionesSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private languageService: LanguageService
  ) {
    // Suscribirse a los cambios de idioma
    this.languageService.currentLang.subscribe(lang => {
      console.log('PromocionesService: Idioma cambiado a', lang);
      this.currentLang = lang;
      this.refreshPromociones();
    });
    
    // Carga inicial
    this.refreshPromociones();
  }

  /**
   * Refrescar los datos de promociones desde el servidor
   */
  private refreshPromociones(): void {
    console.log('PromocionesService: Refrescando promociones con idioma', this.currentLang);
    this.http.get<any[]>(`${this.apiUrl}/promociones?lang=${this.currentLang}`)
      .subscribe({
        next: (data) => {
          console.log('Promociones recibidas:', data.length);
          this.promocionesSubject.next(data);
        },
        error: (err) => console.error('Error al obtener promociones:', err)
      });
  }

  /**
   * Obtener todas las promociones disponibles con traducciones para el idioma actual
   */
  getPromociones(): Observable<any[]> {
    // Devolver los datos en caché y activar una actualización
    return this.promociones$;
  }

  /**
   * Obtener una promoción específica por ID con traducciones para el idioma actual
   */
  getPromocionById(id: number): Observable<any> {
    console.log('PromocionesService: Obteniendo promoción por ID', id, 'con idioma', this.currentLang);
    return this.http.get<any>(`${this.apiUrl}/promociones/${id}?lang=${this.currentLang}`)
      .pipe(
        tap(response => {
          console.log('PromocionesService: Recibidos detalles de promoción', response);
        }),
        catchError(error => {
          console.error('PromocionesService: Error al obtener detalles de promoción', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Inscribir al usuario actual en una promoción
   */
  inscribirEnPromocion(promocionId: number): Observable<any> {
    console.log('PromocionesService: Inscribiendo en promoción con ID', promocionId);
    
    return this.http.post<any>(`${this.apiUrl}/promociones/${promocionId}/inscribir`, {})
      .pipe(
        tap(response => {
          console.log('PromocionesService: Respuesta de inscripción a promoción', response);
        }),
        catchError(error => {
          console.error('PromocionesService: Error al inscribirse en promoción', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtener las promociones en las que está inscrito el usuario actual
   */
  getUserPromociones(): Observable<any[]> {
    console.log('PromocionesService: Obteniendo promociones del usuario con idioma', this.currentLang);
    return this.http.get<any[]>(`${this.apiUrl}/user/promociones?lang=${this.currentLang}`)
      .pipe(
        tap(response => {
          console.log('PromocionesService: Recibidas promociones del usuario', response);
        }),
        catchError(error => {
          console.error('PromocionesService: Error al obtener promociones del usuario', error);
          return throwError(() => error);
        })
      );
  }
}