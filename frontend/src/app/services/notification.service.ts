import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notification$ = this.notificationSubject.asObservable();

  constructor(private translateService: TranslateService) { }

  showSuccess(message: string, duration: number = 3000) {
    const translatedMessage = this.translateService.instant(message);
    this.notificationSubject.next({
      message: translatedMessage,
      type: 'success',
      duration
    });
  }

  showInfo(message: string, duration: number = 3000) {
    const translatedMessage = this.translateService.instant(message);
    this.notificationSubject.next({
      message: translatedMessage,
      type: 'info',
      duration
    });
  }

  showError(message: string, duration: number = 3000) {
    const translatedMessage = this.translateService.instant(message);
    this.notificationSubject.next({
      message: translatedMessage,
      type: 'error',
      duration
    });
  }
}