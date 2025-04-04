import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { Subscription, interval } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

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
  private subscriptions: Subscription[] = [];
  private pollingSubscription: Subscription | null = null;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
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
    
    // Verificar si ya hay un ID de sesión guardado
    if (this.sessionId) {
      this.loadMessages();
      return;
    }

    // Iniciar una nueva sesión
    this.chatService.startNewSession().subscribe({
      next: (response) => {
        this.sessionId = response.session_id;
        this.chatService.setCurrentSessionId(response.session_id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al iniciar chat:', error);
        this.loading = false;
      }
    });
  }

  loadMessages(): void {
    if (!this.sessionId) return;
    
    this.loading = true;
    this.chatService.getMessages(this.sessionId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.loading = false;
        this.scrollToBottom();
        
        // Marcar mensajes como leídos
        this.chatService.markAsRead(this.sessionId!).subscribe();
      },
      error: (error) => {
        console.error('Error al cargar mensajes:', error);
        this.loading = false;
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.sessionId) return;
    
    this.chatService.sendMessage(this.newMessage, this.sessionId).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.newMessage = '';
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
      }
    });
  }

  toggleChat(): void {
    this.chatService.setChatOpen(!this.isOpen);
  }

  startPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
    
    // Consultar nuevos mensajes cada 5 segundos
    this.pollingSubscription = interval(5000).pipe(
      switchMap(() => {
        if (!this.sessionId) return [];
        return this.chatService.getMessages(this.sessionId);
      })
    ).subscribe({
      next: (messages) => {
        if (messages.length !== this.messages.length) {
          this.messages = messages;
          this.scrollToBottom();
          this.chatService.markAsRead(this.sessionId!).subscribe();
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
