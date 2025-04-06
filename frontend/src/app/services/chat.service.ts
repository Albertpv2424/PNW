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



  getActiveSessions(): Observable<any> {
    console.log('Getting active sessions with token:', this.authService.getToken()?.substring(0, 10) + '...');

    // Create a new headers object with all required headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });

    return this.http.get<any>(`${this.apiUrl}/chat/sessions`, {
      headers: headers
    }).pipe(
      catchError(error => {
        console.error('Error fetching active sessions:', error);
        if (error.status === 403) {
          console.error('Permission denied. Check if user has admin rights.');
        }
        return throwError(() => error);
      })
    );
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

  // Método para iniciar una nueva sesión con mensaje inicial
  startNewSession(initialMessage: string = '¡Hola! Necesito ayuda.'): Observable<any> {
    console.log('Starting new chat session with initial message:', initialMessage);

    return this.http.post<any>(`${this.apiUrl}/chat/start`, {
      message: initialMessage
    }, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(response => {
        console.log('Chat session created:', response);
        if (response && response.session_id) {
          this.setCurrentSessionId(response.session_id);
        }
      }),
      catchError(error => {
        console.error('Error creating chat session:', error);
        return throwError(() => error);
      })
    );
  }

  // Método mejorado para obtener mensajes
  getMessages(sessionId: string): Observable<any[]> {
    console.log(`Fetching messages for session: ${sessionId}`);

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
      responseType: 'json'
    }).pipe(
      map((response: any) => {
        console.log('Messages response:', response);

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

        // Si es un error 403, probablemente el usuario no tiene permisos
        // o la sesión pertenece a otro usuario
        if (error.status === 403) {
          console.warn('Permission denied for session:', sessionId);

          // Limpiar la sesión actual si no tenemos acceso a ella
          this.setCurrentSessionId(null);

          // Guardar en localStorage que necesitamos una nueva sesión
          localStorage.setItem('needNewChatSession', 'true');
        }

        // Devolver array vacío para evitar errores en la UI
        return of([]);
      })
    );
  }

  // Método mejorado para enviar mensajes
  sendMessage(message: string, sessionId: string, isAdmin: boolean = false): Observable<any> {
    console.log(`Sending message as ${isAdmin ? 'admin' : 'user'} to session ${sessionId}`);

    // Determinar si el usuario actual es admin
    const currentUser = this.authService.getCurrentUser();
    const userType = currentUser?.tipus_acc?.toLowerCase() || '';
    const isUserAdmin = ['admin', 'administrador'].includes(userType);

    // Solo enviar is_admin=true si el usuario es realmente admin
    const adminFlag = isAdmin && isUserAdmin;

    console.log('Message details:', {
      message: message,
      session_id: sessionId,
      is_admin: adminFlag,
      user_type: userType
    });

    return this.http.post<any>(`${this.apiUrl}/chat/messages`, {
      message,
      session_id: sessionId,
      is_admin: adminFlag
    }, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(response => {
        console.log('Message sent successfully:', response);
      }),
      catchError(error => {
        console.error('Error sending message:', error);
        return throwError(() => error);
      })
    );
  }
}