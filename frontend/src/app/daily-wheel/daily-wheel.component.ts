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
  // Change to match the HTML template
  @ViewChild('wheelCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // Only one ctx declaration
  private ctx!: CanvasRenderingContext2D;

  isOpen = false;
  isSpinning = false;
  canSpin = true;
  lastSpinDate: string | null = null;
  prizes = [100, 50, 200, 25, 500, 75, 150, 10];
  colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC24A', '#607D8B'];
  selectedPrize: number | null = null;

  // Add these missing properties
  lastEarnedPoints: number | null = null;
  showLastEarnedPoints: boolean = false;

  private apiUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Always check spin status when component initializes, not just when open
    this.checkLastSpin();
    // Also check for last earned points
    this.checkLastEarnedPoints();
  }

  ngAfterViewInit() {
    // Only initialize canvas if the wheel is open
    if (this.isOpen) {
      setTimeout(() => this.setupCanvas(), 300);
    }
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
    if (!this.ctx) {
      console.error('Canvas context not initialized');
      return;
    }

    // Your wheel drawing code here
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#333';
    ctx.stroke();

    // Draw segments
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
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#333';
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Rotate text to be readable from outside the wheel
      ctx.rotate(Math.PI / 2);
      ctx.fillText(this.prizes[i].toString(), 0, -radius + 25);
      ctx.restore();
    }

    // Draw central circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.stroke();

    // We're removing the arrow from here as it will be drawn separately
  }

  // Add a new method to draw just the arrow
  drawArrow() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Draw arrow at the RIGHT side instead of the top
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 10, centerY); // Position at right
    ctx.lineTo(centerX + radius - 15, centerY - 15); // Top point
    ctx.lineTo(centerX + radius - 15, centerY + 15); // Bottom point
    ctx.closePath();
    ctx.fillStyle = '#ff4d4d';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    ctx.stroke();
  }

  toggleWheel() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      // Check spin status when opening the wheel
      this.checkLastSpin();
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
    this.selectedPrize = null; // Reset selected prize to hide result until animation completes

    // Número aleatorio de rotaciones (entre 3 y 5 vueltas completas)
    const rotations = 3 + Math.random() * 2;

    // Ángulo aleatorio final (determina el premio)
    const finalAngle = Math.random() * 2 * Math.PI;

    // Animación de giro
    let currentRotation = 0;
    const totalRotation = rotations * 2 * Math.PI + finalAngle;
    const duration = 4000; // 4 segundos para un giro más dramático
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

      // Draw the fixed arrow (outside the rotation transform)
      this.drawArrow();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // IMPORTANTE: Determinar qué premio está en la parte DERECHA (donde apunta la flecha)
        // cuando la rueda se detiene
        const segmentAngle = 2 * Math.PI / this.prizes.length;

        // Normalizar el ángulo final de rotación (entre 0 y 2π)
        const normalizedAngle = (currentRotation % (2 * Math.PI));

        // Calcular qué segmento está a la DERECHA (donde apunta la flecha)
        // La flecha está en la derecha (ángulo 0 en el sistema de coordenadas del canvas)
        const prizeIndex = Math.floor(((2 * Math.PI - normalizedAngle) % (2 * Math.PI)) / segmentAngle);

        // Asegurarnos de que el índice esté dentro del rango válido
        const validIndex = (prizeIndex + this.prizes.length) % this.prizes.length;

        // Establecer el premio seleccionado como el que está en la parte derecha
        this.selectedPrize = this.prizes[validIndex];

        console.log('Final rotation:', currentRotation);
        console.log('Normalized angle:', normalizedAngle);
        console.log('Prize index:', validIndex);
        console.log('Selected prize:', this.selectedPrize);

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

    // Add the authentication headers to the request
    const headers = this.authService.getAuthHeaders();

    // Check with the server instead of localStorage
    this.http.get(`${this.apiUrl}/daily-wheel/status`, { headers }).subscribe({
      next: (response: any) => {
        console.log('Wheel status response:', response);
        this.canSpin = response.canSpin;

        // Store the points earned from the response
        if (response.pointsEarned && response.pointsEarned > 0) {
          this.lastEarnedPoints = response.pointsEarned;
          // Only show the last earned points if the user can't spin today
          this.showLastEarnedPoints = !response.canSpin;
        }

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

  // Add this new method
  checkLastEarnedPoints() {
    // We'll use localStorage to remember points between sessions
    const storedPoints = localStorage.getItem('lastWheelPoints');
    if (storedPoints) {
      this.lastEarnedPoints = parseInt(storedPoints, 10);
      this.showLastEarnedPoints = true;
    }
  }

  awardPrize() {
    if (!this.selectedPrize) return;

    // No longer need to store in localStorage since we're using the server
    this.canSpin = false;

    console.log('Awarding prize:', this.selectedPrize);

    // Add the authentication headers to the request
    const headers = this.authService.getAuthHeaders();

    // Enviar al servidor con los headers correctos
    this.http.post(`${this.apiUrl}/daily-wheel/spin`, { points: this.selectedPrize }, { headers }).subscribe({
      next: (response: any) => {
        console.log('Prize awarded response:', response);
        // Actualizar el saldo del usuario
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          currentUser.saldo = response.saldo;
          this.authService.updateCurrentUser(currentUser);
        }

        // Store the points in localStorage for future sessions
        localStorage.setItem('lastWheelPoints', this.selectedPrize?.toString() || '0');
        this.lastEarnedPoints = this.selectedPrize;
        this.showLastEarnedPoints = true;

        // Set canSpin to false immediately after successful response
        this.canSpin = false;
        const today = new Date().toISOString().split('T')[0];
        this.lastSpinDate = today;

        this.notificationService.showSuccess(`¡Felicidades! Has ganado ${this.selectedPrize} puntos`);

        // Cerrar la ruleta después de 3 segundos
        setTimeout(() => {
          this.isOpen = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error al procesar el premio:', error);

        // Only reset canSpin if it's not a "already spun" error
        if (error.status === 400 && error.error && error.error.message === 'Ya has girado la ruleta hoy') {
          this.canSpin = false;
          const today = new Date().toISOString().split('T')[0];
          this.lastSpinDate = today;
          this.notificationService.showError('Ya has girado la ruleta hoy. Vuelve mañana para más premios.');
        } else {
          this.canSpin = true; // Allow the user to try again for other errors
          this.notificationService.showError(error.error?.message || 'Ha ocurrido un error al procesar tu premio. Inténtalo de nuevo.');
        }

        if (error.status === 401) {
          this.notificationService.showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.authService.logout();
        }
      }
    });
  }
}
