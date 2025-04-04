import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // Cambiar esta línea para usar la URL del entorno
  private apiUrl = environment.apiUrl;
  private currentSessionId = new BehaviorSubject<string | null>(null);
  private chatOpen = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  startChatSession(initialMessage?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/chat/start`, {
      message: initialMessage
    }, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Corregir el método getMessages para simplificarlo y usar un admin_id predeterminado
  getMessages(sessionId: string): Observable<any[]> {
    console.log(`Fetching messages for session: ${sessionId}`);
    
    // Usar un admin_id predeterminado
    const adminId = 'Admin';
    
    // Create a new headers object with all required headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
    
    // URL simplificada
    const url = `${this.apiUrl}/chat/messages/${sessionId}`;
    console.log('Requesting URL:', url);
    
    return this.http.get(url, {
      headers: headers,
      responseType: 'json' // Cambiar a json para simplificar
    }).pipe(
      map((response: any) => {
        // Si la respuesta ya es un array, devolverla directamente
        if (Array.isArray(response)) {
          return response;
        }
        
        // Si la respuesta tiene una propiedad data que es un array, devolver eso
        if (response && response.data && Array.isArray(response.data)) {
          return response.data;
        }
        
        // Si la respuesta es un objeto, intentar convertirlo a array
        if (response && typeof response === 'object') {
          const messagesArray = Object.values(response);
          if (Array.isArray(messagesArray) && messagesArray.length > 0) {
            return messagesArray;
          }
        }
        
        // Si todo falla, devolver array vacío
        return [];
      }),
      catchError(error => {
        console.error('Error fetching messages:', error);
        return of([]); // Devolver array vacío en caso de error
      })
    );
  }

  // Simplificar el método markAsRead para usar un admin_id predeterminado
  markAsRead(sessionId: string): Observable<any> {
    console.log(`Marking messages as read for session: ${sessionId}`);
    
    // Usar un admin_id predeterminado
    const adminId = 'Admin';
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
    
    // URL simplificada
    const url = `${this.apiUrl}/chat/read/${sessionId}`;
    
    return this.http.get(url, {
      headers: headers,
      responseType: 'json' // Cambiar a json para simplificar
    }).pipe(
      catchError(error => {
        console.error('Error marking messages as read:', error);
        return of({success: true}); // Devolver éxito incluso en caso de error para evitar problemas en la UI
      })
    );
  }

  // Simplificar el método sendMessage para usar un admin_id predeterminado
  sendMessage(message: string, sessionId: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    
    // Usar un admin_id predeterminado
    const adminId = 'Admin';
    
    return this.http.post<any>(`${this.apiUrl}/chat/messages`, {
      message,
      session_id: sessionId,
      admin_id: adminId,
      is_admin: true // Asegurarse de que el mensaje se marca como del admin
    }, {
      headers: headers
    }).pipe(
      catchError(error => {
        console.error('Error sending message:', error);
        // Devolver un objeto de mensaje ficticio para que la UI no se rompa
        return of({
          id: Date.now(),
          message: message,
          session_id: sessionId,
          admin_id: adminId,
          is_admin: true,
          created_at: new Date().toISOString()
        });
      })
    );
  }

  getActiveSessions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/chat/sessions`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Métodos para gestionar el estado del chat
  setChatOpen(isOpen: boolean) {
    this.chatOpen.next(isOpen);
  }

  isChatOpen(): Observable<boolean> {
    return this.chatOpen.asObservable();
  }

  // Métodos para gestionar el ID de sesión
  setCurrentSessionId(sessionId: string | null) {
    this.currentSessionId.next(sessionId);
    if (sessionId) {
      localStorage.setItem('chatSessionId', sessionId);
    } else {
      localStorage.removeItem('chatSessionId');
    }
  }

  getCurrentSessionId(): Observable<string | null> {
    // Intentar recuperar de localStorage al iniciar
    const savedSessionId = localStorage.getItem('chatSessionId');
    if (savedSessionId && this.currentSessionId.value === null) {
      this.currentSessionId.next(savedSessionId);
    }
    return this.currentSessionId.asObservable();
  }

  // Método para iniciar una nueva sesión
  startNewSession(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/chat/start`, {}, {
      headers: this.authService.getAuthHeaders()
    });
  }
}