import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notification$ = this.notificationSubject.asObservable();

  constructor() { }

  showSuccess(message: string, duration: number = 3000) {
    this.notificationSubject.next({
      message,
      type: 'success',
      duration
    });
  }

  showError(message: string, duration: number = 3000) {
    this.notificationSubject.next({
      message,
      type: 'error',
      duration
    });
  }
}