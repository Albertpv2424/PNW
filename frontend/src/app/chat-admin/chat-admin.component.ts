import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service'; // Make sure this import is present
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Define interface for chat session
interface ChatSession {
  session_id: string;
  user_id: string;
  admin_id: string;
  last_message: string;
  last_message_time: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
  unread_count: number;
  last_message_preview?: string;
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
  private sessionRefreshInterval: any;
  // In the constructor, make sure NotificationService is properly injected
  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private notificationService: NotificationService  // Make sure this is properly injected
  ) {}

  // Update the sendMessage method to better handle errors
  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedSessionId) return;

    const messageText = this.newMessage.trim(); // Guardar el mensaje antes de limpiarlo

    // Asegurarse de que se envía como admin (true)
    this.chatService.sendMessage(messageText, this.selectedSessionId, true).subscribe({
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

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }

  // Add this new method
  formatTime(timestamp: string | null): string {
    if (!timestamp) return 'N/A';

    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getTotalUnreadCount(): number {
    return this.sessions.reduce((total, session) => total + session.unread_count, 0);
  }

  // Add the missing loadSessions method
  loadSessions(): void {
    this.loading = true;
    this.chatService.getActiveSessions().subscribe({
      next: (sessions) => {
        console.log('Received sessions:', sessions);
        if (Array.isArray(sessions) && sessions.length > 0) {
          this.sessions = sessions.sort((a: ChatSession, b: ChatSession) => {
            // Sort by last_message_time, handling null values
            const timeA = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
            const timeB = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
            return timeB - timeA;
          });
          console.log('Processed sessions:', this.sessions);
        } else {
          console.warn('No active sessions found or invalid response format');
          this.sessions = [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading chat sessions:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.error?.message || 'Unknown error'
        });
        this.loading = false;
        this.notificationService.showError('No se pudieron cargar las conversaciones. Por favor, intenta de nuevo más tarde.');
      }
    });
  }

  // Add a method to refresh sessions periodically
  startSessionRefresh(): void {
    // Refresh sessions every 10 seconds
    this.sessionRefreshInterval = setInterval(() => {
      this.loadSessions();
    }, 10000);
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    // Check if user is admin with case-insensitive comparison and multiple valid admin types
    const userType = this.currentUser?.tipus_acc?.toLowerCase() || '';
    const isAdmin = ['admin', 'administrador'].includes(userType);

    if (!this.currentUser || !isAdmin) {
      console.error('User is not an admin:', this.currentUser);
      this.notificationService.showError('No tienes permisos de administrador para acceder a esta sección.');
      return;
    }

    console.log('Admin user detected:', this.currentUser.nick);
    this.loadSessions();

    // Start session refresh
    this.startSessionRefresh();

    // Iniciar polling para actualizar sesiones
    this.startSessionPolling();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }

    // Clear the interval when component is destroyed
    if (this.sessionRefreshInterval) {
      clearInterval(this.sessionRefreshInterval);
    }
  }

  // Add this method after the loadSessions method
  selectSession(sessionId: string): void {
    this.selectedSessionId = sessionId;
    this.loadMessages(sessionId);

    // Iniciar polling para esta sesión
    this.startMessagePolling(sessionId);
  }

  loadMessages(sessionId: string): void {
    this.loading = true;
    console.log(`Loading messages for session: ${sessionId}`);

    this.chatService.getMessages(sessionId).subscribe({
      next: (messages) => {
        console.log('Received messages:', messages);
        this.messages = messages;
        this.scrollToBottom();
        this.loading = false;

        // Mark messages as read
        this.chatService.markAsRead(sessionId).subscribe({
          next: () => console.log('Messages marked as read'),
          error: (err) => console.error('Error marking messages as read:', err)
        });
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.error?.message || 'Unknown error'
        });
        this.loading = false;
        this.notificationService.showError('Error al cargar los mensajes. Por favor, intenta de nuevo.');
      }
    });
  }

  // Add this method to your ChatAdminComponent class
// Update the handleEnterKey method to properly handle the event type
handleEnterKey(event: Event): void {
// Cast the event to KeyboardEvent to access keyboard-specific properties
const keyboardEvent = event as KeyboardEvent;

// If Ctrl key is pressed, allow default behavior (new line)
if (!keyboardEvent.ctrlKey) {
event.preventDefault();
this.sendMessage();
}
}
}