import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-daily-wheel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-wheel.component.html',
  styleUrls: ['./daily-wheel.component.css']
})
export class DailyWheelComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  isOpen = false;
  isSpinning = false;
  canSpin = true;
  lastSpinDate: string | null = null;
  prizes = [100, 50, 200, 25, 500, 75, 150, 10];
  colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC24A', '#607D8B'];
  selectedPrize: number | null = null;
  
  private ctx!: CanvasRenderingContext2D;
  private apiUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.checkLastSpin();
    // Remove the setupCanvas call from here
  }

  ngAfterViewInit() {
    // Move canvas setup to ngAfterViewInit where the view is guaranteed to be ready
    setTimeout(() => {
      this.setupCanvas();
    }, 100);
  }

  setupCanvas() {
    if (!this.canvasRef) {
      console.error('Canvas reference not found');
      return;
    }
    
    const canvas = this.canvasRef.nativeElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    
    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Could not get 2D context');
      return;
    }
    
    this.ctx = context;
    
    // Set explicit dimensions
    canvas.width = 300;
    canvas.height = 300;
    
    this.drawWheel();
  }

  drawWheel() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar segmentos
    const segmentAngle = 2 * Math.PI / this.prizes.length;
    
    for (let i = 0; i < this.prizes.length; i++) {
      const startAngle = i * segmentAngle;
      const endAngle = (i + 1) * segmentAngle;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = this.colors[i];
      ctx.fill();
      
      // Dibujar texto
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(this.prizes[i].toString(), radius - 20, 5);
      ctx.restore();
    }
    
    // Dibujar círculo central
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.stroke();
    
    // Dibujar flecha
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 10, centerY);
    ctx.lineTo(centerX + radius - 10, centerY - 15);
    ctx.lineTo(centerX + radius - 10, centerY + 15);
    ctx.closePath();
    ctx.fillStyle = '#000';
    ctx.fill();
  }

  toggleWheel() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      // Add a longer delay to ensure the modal is fully rendered
      setTimeout(() => this.setupCanvas(), 300);
    }
  }

  spinWheel() {
    if (!this.canSpin || this.isSpinning) return;
    
    if (!this.authService.isLoggedIn()) {
      this.notificationService.showError('Debes iniciar sesión para girar la ruleta');
      return;
    }
    
    this.isSpinning = true;
    
    // Número aleatorio de rotaciones (entre 3 y 5 vueltas completas)
    const rotations = 3 + Math.random() * 2;
    
    // Ángulo aleatorio final (determina el premio)
    const finalAngle = Math.random() * 2 * Math.PI;
    
    // Calcular el premio basado en el ángulo final
    const segmentAngle = 2 * Math.PI / this.prizes.length;
    const prizeIndex = Math.floor(((2 * Math.PI - finalAngle) % (2 * Math.PI)) / segmentAngle);
    this.selectedPrize = this.prizes[prizeIndex];
    
    // Animación de giro
    let currentRotation = 0;
    const totalRotation = rotations * 2 * Math.PI + finalAngle;
    const duration = 3000; // 3 segundos
    const startTime = Date.now();
    
    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Función de easing para desacelerar gradualmente
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      
      currentRotation = totalRotation * easeOut(progress);
      
      const canvas = this.canvasRef.nativeElement;
      const ctx = this.ctx;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(currentRotation);
      ctx.translate(-centerX, -centerY);
      
      this.drawWheel();
      
      ctx.restore();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        this.awardPrize();
      }
    };
    
    animate();
  }

  checkLastSpin() {
    if (!this.authService.isLoggedIn()) {
      this.canSpin = true;
      return;
    }
    
    // Check with the server instead of localStorage
    this.http.get(`${this.apiUrl}/daily-wheel/status`).subscribe({
      next: (response: any) => {
        console.log('Wheel status response:', response);
        this.canSpin = response.canSpin;
        if (!this.canSpin) {
          const today = new Date().toISOString().split('T')[0];
          this.lastSpinDate = today;
        }
      },
      error: (error) => {
        console.error('Error checking wheel status:', error);
        // Default to allowing spin if there's an error
        this.canSpin = true;
        
        // Check if it's an authentication error
        if (error.status === 401) {
          this.notificationService.showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.authService.logout();
        }
      }
    });
  }

  awardPrize() {
    if (!this.selectedPrize) return;
    
    // No longer need to store in localStorage since we're using the server
    this.canSpin = false;
    
    // Enviar al servidor
    this.http.post(`${this.apiUrl}/daily-wheel/spin`, { points: this.selectedPrize }).subscribe({
      next: (response: any) => {
        console.log('Prize awarded response:', response);
        // Actualizar el saldo del usuario
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          currentUser.saldo = response.saldo;
          this.authService.updateCurrentUser(currentUser);
        }
        
        this.notificationService.showSuccess(`¡Felicidades! Has ganado ${this.selectedPrize} puntos`);
        
        // Cerrar la ruleta después de 3 segundos
        setTimeout(() => {
          this.isOpen = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error al procesar el premio:', error);
        this.canSpin = true; // Allow the user to try again
        
        if (error.status === 401) {
          this.notificationService.showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.authService.logout();
        } else {
          this.notificationService.showError('Ha ocurrido un error al procesar tu premio. Inténtalo de nuevo.');
        }
      }
    });
  }
}
