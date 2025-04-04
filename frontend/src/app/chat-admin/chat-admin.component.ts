import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service'; // Add this import
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Define interface for chat session
interface ChatSession {
  session_id: string;
  user: {
    nick: string;
    name?: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

@Component({
  selector: 'app-chat-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-admin.component.html',
  styleUrls: ['./chat-admin.component.css']
})
export class ChatAdminComponent implements OnInit, OnDestroy {
  sessions: ChatSession[] = [];
  messages: any[] = [];
  newMessage: string = '';
  selectedSessionId: string | null = null;
  loading: boolean = false;
  currentUser: any;
  private subscriptions: Subscription[] = [];
  private pollingSubscription: Subscription | null = null;
  notificationService: any;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSessions();
    
    // Iniciar polling para actualizar sesiones
    this.startSessionPolling();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadSessions(): void {
    this.loading = true;
    this.chatService.getActiveSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions.sort((a: ChatSession, b: ChatSession) => {
          return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar sesiones:', error);
        // Add more detailed error logging
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.error?.message || 'Unknown error'
        });
        this.loading = false;
        // Show a user-friendly error message
        this.notificationService.showError('No se pudieron cargar las conversaciones. Por favor, intenta de nuevo más tarde.');
      }
    });
  }

  selectSession(sessionId: string): void {
    this.selectedSessionId = sessionId;
    this.loadMessages(sessionId);
    
    // Iniciar polling para esta sesión
    this.startMessagePolling(sessionId);
  }

  loadMessages(sessionId: string): void {
    this.loading = true;
    this.chatService.getMessages(sessionId).subscribe({
      next: (messages) => {
        // Check if messages is valid
        if (!messages) {
          console.warn('Received null or undefined messages');
          this.messages = [];
        } else {
          this.messages = messages;
        }
        
        this.loading = false;
        this.scrollToBottom();
        
        // Marcar mensajes como leídos
        this.chatService.markAsRead(sessionId).subscribe({
          next: () => {
            // Actualizar el contador de no leídos en la sesión seleccionada
            const session = this.sessions.find(s => s.session_id === sessionId);
            if (session) {
              session.unread_count = 0;
            }
          },
          error: (readError) => {
            console.error('Error al marcar mensajes como leídos:', readError);
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar mensajes:', error);
        // Add more detailed error logging
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.error?.message || 'Unknown error'
        });
        this.loading = false;
      }
    });
  }

  // Corregir el método sendMessage en el componente chat-admin
  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedSessionId) return;
    
    const messageText = this.newMessage.trim(); // Guardar el mensaje antes de limpiarlo
    
    this.chatService.sendMessage(messageText, this.selectedSessionId).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.newMessage = '';
        this.scrollToBottom();
        
        // Actualizar la última hora y mensaje en la lista de sesiones
        const session = this.sessions.find(s => s.session_id === this.selectedSessionId);
        if (session) {
          session.last_message = messageText; // Usar el mensaje guardado en lugar de this.newMessage (que ya está vacío)
          session.last_message_time = new Date().toISOString();
        }
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
      }
    });
  }

  startSessionPolling(): void {
    // Consultar sesiones activas cada 10 segundos
    this.pollingSubscription = interval(10000).pipe(
      switchMap(() => this.chatService.getActiveSessions())
    ).subscribe({
      next: (sessions) => {
        // Ordenar por tiempo del último mensaje
        this.sessions = sessions.sort((a: ChatSession, b: ChatSession) => {
          return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
        });
      },
      error: (error) => {
        console.error('Error en polling de sesiones:', error);
      }
    });
  }

  startMessagePolling(sessionId: string): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
    
    // Consultar nuevos mensajes cada 5 segundos
    this.pollingSubscription = interval(5000).pipe(
      switchMap(() => this.chatService.getMessages(sessionId))
    ).subscribe({
      next: (messages) => {
        if (messages.length !== this.messages.length) {
          this.messages = messages;
          this.scrollToBottom();
          this.chatService.markAsRead(sessionId).subscribe();
        }
      },
      error: (error) => {
        console.error('Error en polling de mensajes:', error);
      }
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.admin-chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }

  getTotalUnreadCount(): number {
    return this.sessions.reduce((total, session) => total + session.unread_count, 0);
  }
}