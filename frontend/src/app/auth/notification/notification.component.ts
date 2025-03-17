import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  visible = false;
  message = '';
  type: 'success' | 'error' | 'info' = 'success';  // Update type to include 'info'
  private subscription: Subscription | null = null;
  private timeout: any;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.subscription = this.notificationService.notification$.subscribe(notification => {
      this.message = notification.message;
      this.type = notification.type;
      this.visible = true;

      // Clear any existing timeout
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      // Set timeout to hide notification
      this.timeout = setTimeout(() => {
        this.visible = false;
      }, notification.duration || 3000);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}