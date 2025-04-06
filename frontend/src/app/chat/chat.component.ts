import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { Subscription, interval, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage: string = '';
  sessionId: string | null = null;
  isOpen: boolean = false;
  loading: boolean = false;
  currentUser: any;
  errorMessage: string | null = null; // Añadir esta propiedad
  private subscriptions: Subscription[] = [];
  private pollingSubscription: Subscription | null = null;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    // Verificar si necesitamos una nueva sesión (después de un error 403)
    const needNewSession = localStorage.getItem('needNewChatSession') === 'true';
    if (needNewSession) {
      console.log('Need new session flag detected, clearing session ID');
      this.sessionId = null;
      this.chatService.setCurrentSessionId(null);
      localStorage.removeItem('needNewChatSession');
    }

    // Suscribirse al estado de apertura del chat
    this.subscriptions.push(
      this.chatService.isChatOpen().subscribe(isOpen => {
        this.isOpen = isOpen;
        if (isOpen && !this.sessionId) {
          this.initializeChat();
        }
        if (isOpen && this.sessionId) {
          this.startPolling();
        } else if (!isOpen && this.pollingSubscription) {
          this.pollingSubscription.unsubscribe();
          this.pollingSubscription = null;
        }
      })
    );

    // Suscribirse al ID de sesión actual
    this.subscriptions.push(
      this.chatService.getCurrentSessionId().subscribe(sessionId => {
        console.log('Session ID changed:', sessionId);
        this.sessionId = sessionId;
        if (sessionId && this.isOpen) {
          this.loadMessages();
          this.startPolling();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  initializeChat(): void {
    this.loading = true;
    console.log('Initializing chat...');

    // Verificar si ya hay un ID de sesión guardado
    if (this.sessionId) {
      console.log('Using existing session ID:', this.sessionId);
      this.loadMessages();
      return;
    }

    console.log('Starting new chat session...');

    // Iniciar una nueva sesión con un mensaje inicial
    const initialMessage = '¡Hola! Necesito ayuda con mi cuenta.';
    this.chatService.startNewSession(initialMessage).subscribe({
      next: (response) => {
        console.log('New session created:', response);
        if (!response || !response.session_id) {
          console.error('Invalid response from startNewSession:', response);
          this.errorMessage = 'Error al iniciar el chat: respuesta inválida del servidor';
          this.loading = false;
          return;
        }

        this.sessionId = response.session_id;
        this.chatService.setCurrentSessionId(response.session_id);
        this.loading = false;

        // Cargar mensajes después de crear la sesión
        this.loadMessages();
      },
      error: (error) => {
        console.error('Error al iniciar chat:', error);
        this.loading = false;
        this.errorMessage = 'No se pudo iniciar el chat. Por favor, intenta de nuevo.';
      }
    });
  }

  loadMessages(): void {
    if (!this.sessionId) {
      console.error('Cannot load messages: No session ID');
      return;
    }

    console.log('Loading messages for session:', this.sessionId);
    this.loading = true;

    this.chatService.getMessages(this.sessionId).subscribe({
      next: (messages) => {
        console.log('Messages loaded:', messages);
        this.messages = messages;
        this.loading = false;
        this.scrollToBottom();
        this.errorMessage = null;

        // Marcar mensajes como leídos
        this.chatService.markAsRead(this.sessionId!).subscribe({
          next: () => console.log('Messages marked as read'),
          error: (err) => console.error('Error marking messages as read:', err)
        });
      },
      error: (error) => {
        console.error('Error al cargar mensajes:', error);
        this.loading = false;
        this.errorMessage = 'Error al cargar los mensajes. Por favor, intenta de nuevo.';

        // Si el error es 403, podría ser que la sesión ya no sea válida
        if (error.status === 403) {
          console.log('Session might be invalid, trying to create a new one...');
          this.sessionId = null;
          this.chatService.setCurrentSessionId(null);
          // Intentar crear una nueva sesión
          this.initializeChat();
        }
      }
    });
  }



  sendMessage(): void {
    if (!this.newMessage.trim() || !this.sessionId) return;

    const messageText = this.newMessage.trim();

    // Enviar como usuario normal (false)
    this.chatService.sendMessage(messageText, this.sessionId, false).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.newMessage = '';
        this.scrollToBottom();
        this.errorMessage = null; // Limpiar el mensaje de error si hay éxito
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
        this.errorMessage = 'No se pudo enviar el mensaje. Por favor, intenta de nuevo.';
      }
    });
  }

  toggleChat(): void {
    this.chatService.setChatOpen(!this.isOpen);
  }

  startPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }

    console.log('Starting polling for session:', this.sessionId);

    // Consultar nuevos mensajes cada 5 segundos
    this.pollingSubscription = interval(5000).pipe(
      switchMap(() => {
        if (!this.sessionId) {
          console.log('No session ID for polling');
          return of([]);
        }
        console.log('Polling for new messages...');
        return this.chatService.getMessages(this.sessionId).pipe(
          catchError(error => {
            console.error('Error in polling:', error);

            // Si hay un error 403, detener el polling e iniciar una nueva sesión
            if (error.status === 403) {
              console.warn('Permission denied in polling, stopping and resetting');

              if (this.pollingSubscription) {
                this.pollingSubscription.unsubscribe();
                this.pollingSubscription = null;
              }

              // Reiniciar la sesión
              this.sessionId = null;
              this.chatService.setCurrentSessionId(null);

              // Marcar que necesitamos una nueva sesión
              localStorage.setItem('needNewChatSession', 'true');

              // Iniciar una nueva sesión
              this.initializeChat();
            }

            return of([]);
          })
        );
      })
    ).subscribe({
      next: (messages) => {
        if (messages && messages.length > 0) {
          // Solo actualizar si hay cambios en los mensajes
          const currentMessagesCount = this.messages.length;
          const newMessagesCount = messages.length;

          if (newMessagesCount !== currentMessagesCount) {
            console.log(`New messages received in polling (${currentMessagesCount} -> ${newMessagesCount})`);
            this.messages = messages;
            this.scrollToBottom();

            // Solo marcar como leídos si tenemos un ID de sesión válido
            if (this.sessionId) {
              this.chatService.markAsRead(this.sessionId).subscribe({
                next: () => console.log('Messages marked as read'),
                error: (err) => console.error('Error marking messages as read:', err)
              });
            }
          }
        }
      },
      error: (error) => {
        console.error('Error en polling de mensajes:', error);
      }
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
