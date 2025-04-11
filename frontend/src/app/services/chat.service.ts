import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { TranslateService } from '@ngx-translate/core'; // Add this import

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
    private authService: AuthService,
    private translateService: TranslateService // Add this dependency
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

  // Métodos para gestionar el ID de sesión - KEEP ONLY THIS IMPLEMENTATION
  setCurrentSessionId(sessionId: string | null): void {
    console.log('Setting current session ID:', sessionId);

    // Guardar en BehaviorSubject
    this.currentSessionId.next(sessionId);

    // Guardar en localStorage para persistencia
    if (sessionId) {
      localStorage.setItem('chatSessionId', sessionId);
    } else {
      localStorage.removeItem('chatSessionId');
    }

    // Guardar el usuario actual para detectar cambios
    const currentUser = this.authService.getCurrentUser()?.nick || '';
    if (currentUser) {
      localStorage.setItem('lastChatUser', currentUser);
    }
  }

  // Método mejorado para obtener el ID de sesión actual
  getCurrentSessionId(): Observable<string | null> {
    // Verificar si hay un ID de sesión en el BehaviorSubject
    const currentId = this.currentSessionId.getValue();

    if (!currentId) {
      // Si no hay ID en el BehaviorSubject, intentar recuperarlo del localStorage
      const storedId = localStorage.getItem('chatSessionId');
      const currentUser = this.authService.getCurrentUser()?.nick || '';
      const lastUser = localStorage.getItem('lastChatUser') || '';

      // Solo usar el ID almacenado si el usuario no ha cambiado
      if (storedId && currentUser === lastUser) {
        console.log('Restoring session ID from localStorage:', storedId);
        this.currentSessionId.next(storedId);
        return of(storedId);
      }
    }

    return this.currentSessionId.asObservable();
  }

// Método mejorado para iniciar una nueva sesión
startNewSession(initialMessage?: string): Observable<any> {
  // If no message is provided, use the translated default message
  if (!initialMessage) {
    initialMessage = this.translateService.instant('CHAT.INITIAL_MESSAGE');
  }
  
  console.log('Starting new chat session with initial message:', initialMessage);

  // Limpiar la bandera de necesidad de nueva sesión
  localStorage.removeItem('needNewChatSession');

  // Guardar el usuario actual
  const currentUser = this.authService.getCurrentUser()?.nick || '';
  localStorage.setItem('lastChatUser', currentUser);

  return this.http.post<any>(`${this.apiUrl}/chat/start`, {
    message: initialMessage
  }, {
    headers: this.authService.getAuthHeaders()
  }).pipe(
    tap(response => {
      console.log('Chat session created:', response);
      if (response && response.session_id) {
        // Guardar la sesión en localStorage para persistencia
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

  // Nuevo método para que los administradores borren sesiones de chat
  deleteSession(sessionId: string): Observable<any> {
    console.log(`Deleting chat session: ${sessionId}`);

    // Verificar si el usuario es administrador
    const currentUser = this.authService.getCurrentUser();
    const userType = currentUser?.tipus_acc?.toLowerCase() || '';
    const isUserAdmin = ['admin', 'administrador'].includes(userType);

    if (!isUserAdmin) {
      console.error('Permission denied: Only administrators can delete chat sessions');
      return throwError(() => new Error('Permission denied: Only administrators can delete chat sessions'));
    }

    return this.http.delete<any>(`${this.apiUrl}/chat/sessions/${sessionId}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(response => {
        console.log('Chat session deleted successfully:', response);
      }),
      catchError(error => {
        console.error('Error deleting chat session:', error);
        return throwError(() => error);
      })
    );
  }

  // Método para borrar múltiples sesiones de chat (por ejemplo, más antiguas que cierta fecha)
  deleteOldSessions(olderThanDays: number = 30): Observable<any> {
    console.log(`Deleting chat sessions older than ${olderThanDays} days`);

    // Verificar si el usuario es administrador
    const currentUser = this.authService.getCurrentUser();
    const userType = currentUser?.tipus_acc?.toLowerCase() || '';
    const isUserAdmin = ['admin', 'administrador'].includes(userType);

    if (!isUserAdmin) {
      console.error('Permission denied: Only administrators can delete chat sessions');
      return throwError(() => new Error('Permission denied: Only administrators can delete chat sessions'));
    }

    return this.http.delete<any>(`${this.apiUrl}/chat/sessions/old/${olderThanDays}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(response => {
        console.log('Old chat sessions deleted successfully:', response);
      }),
      catchError(error => {
        console.error('Error deleting old chat sessions:', error);
        return throwError(() => error);
      })
    );
  }
}