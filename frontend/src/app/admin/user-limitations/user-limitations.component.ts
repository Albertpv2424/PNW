import { Component, OnInit } from '@angular/core';
import { UserLimitationsService } from '../../services/user-limitations.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-limitations',
  templateUrl: './user-limitations.component.html',
  styleUrls: ['./user-limitations.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserLimitationsComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  searchTerm: string = '';
  loading: boolean = true;
  editMode: boolean = false;
  maxDailyBets: number = 5;
  maxDailyBettingTime: number = 3600;
  showGlobalLimitationsModal: boolean = false;
  globalLimitations = {
    max_daily_bets: 5,
    max_daily_betting_time: 3600
  };

  constructor(
    private userLimitationsService: UserLimitationsService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadAllUsersLimitations();
    this.loadDefaultLimitations();
  }

  loadAllUsersLimitations(): void {
    this.loading = true;
    this.userLimitationsService.getAllUsersLimitations().subscribe({
      next: (data) => {
        console.log('Datos de limitaciones recibidos:', data);
        this.users = data.map(user => ({
          ...user,
          limitations_enabled: user.max_daily_bets < 999999
        }));
        this.filteredUsers = [...this.users];
        this.loading = false;
        
        // Si hay un usuario seleccionado, actualizar sus datos
        if (this.selectedUser) {
          const updatedUser = this.users.find(u => u.username === this.selectedUser.username);
          if (updatedUser) {
            this.selectedUser = updatedUser;
            this.maxDailyBets = updatedUser.max_daily_bets;
            this.maxDailyBettingTime = updatedUser.max_daily_betting_time;
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar limitaciones de usuarios:', error);
        this.notificationService.showError('Error al cargar datos de limitaciones');
        this.loading = false;
      }
    });
  }

  loadDefaultLimitations(): void {
    this.userLimitationsService.getDefaultLimitations().subscribe({
      next: (data) => {
        this.globalLimitations = {
          max_daily_bets: data.max_daily_bets,
          max_daily_betting_time: data.max_daily_betting_time
        };
      },
      error: (error) => {
        console.error('Error al cargar limitaciones predeterminadas:', error);
      }
    });
  }

  filterUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(searchTermLower) ||
      (user.email && user.email.toLowerCase().includes(searchTermLower))
    );
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.maxDailyBets = user.max_daily_bets;
    this.maxDailyBettingTime = user.max_daily_betting_time;
    this.editMode = false;
    
    console.log('Usuario seleccionado:', user);
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  updateLimitations(): void {
    if (!this.selectedUser) return;

    // Validar valores
    if (this.maxDailyBets < 1) {
      this.notificationService.showError('El máximo de apuestas diarias debe ser al menos 1');
      return;
    }

    if (this.maxDailyBettingTime < 60) {
      this.notificationService.showError('El tiempo máximo debe ser al menos 60 segundos');
      return;
    }

    const limitations = {
      max_daily_bets: this.maxDailyBets,
      max_daily_betting_time: this.maxDailyBettingTime
    };

    this.userLimitationsService.updateUserLimitations(this.selectedUser.username, limitations).subscribe({
      next: (response) => {
        console.log('Limitaciones actualizadas:', response);
        this.notificationService.showSuccess('Restricciones actualizadas correctamente');
        this.editMode = false;
        this.loadAllUsersLimitations();
      },
      error: (error) => {
        console.error('Error al actualizar restricciones:', error);
        this.notificationService.showError('Error al actualizar las restricciones');
      }
    });
  }

  resetLimitations(): void {
    if (!this.selectedUser) return;

    this.userLimitationsService.resetUserLimitations(this.selectedUser.username).subscribe({
      next: (response) => {
        console.log('Contadores reiniciados:', response);
        this.notificationService.showSuccess('Contadores de apuestas reiniciados correctamente');
        this.loadAllUsersLimitations();
      },
      error: (error) => {
        console.error('Error al reiniciar contadores:', error);
        this.notificationService.showError('Error al reiniciar los contadores');
      }
    });
  }

  toggleLimitations(user: any, event: any): void {
    const enabled = event.target.checked;
    event.stopPropagation();
    
    this.userLimitationsService.toggleUserLimitations(user.username, enabled).subscribe({
      next: (response) => {
        console.log('Estado de limitaciones cambiado:', response);
        user.limitations_enabled = enabled;
        
        // Si es el usuario seleccionado, actualizar también sus datos
        if (this.selectedUser && this.selectedUser.username === user.username) {
          this.selectedUser.limitations_enabled = enabled;
        }
        
        this.notificationService.showSuccess(
          enabled ? 'Restricciones activadas correctamente' : 'Restricciones desactivadas correctamente'
        );
      },
      error: (error) => {
        console.error('Error al cambiar estado de limitaciones:', error);
        // Revertir el cambio en la UI
        event.target.checked = !enabled;
        user.limitations_enabled = !enabled;
        this.notificationService.showError('Error al cambiar el estado de las restricciones');
      }
    });
  }

  isLimitationsEnabled(user: any): boolean {
    return user.limitations_enabled;
  }

  formatTime(seconds: number): string {
    if (!seconds) return '0h 0m';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  }

  openGlobalLimitationsModal(): void {
    this.showGlobalLimitationsModal = true;
  }

  closeGlobalLimitationsModal(): void {
    this.showGlobalLimitationsModal = false;
  }

  saveGlobalLimitations(): void {
    // Validar valores
    if (this.globalLimitations.max_daily_bets < 1) {
      this.notificationService.showError('El máximo de apuestas diarias debe ser al menos 1');
      return;
    }

    if (this.globalLimitations.max_daily_betting_time < 60) {
      this.notificationService.showError('El tiempo máximo debe ser al menos 60 segundos');
      return;
    }

    this.userLimitationsService.setGlobalLimitations(this.globalLimitations).subscribe({
      next: (response) => {
        console.log('Limitaciones globales actualizadas:', response);
        this.notificationService.showSuccess(`Limitaciones globales aplicadas a ${response.updated_users} usuarios`);
        this.closeGlobalLimitationsModal();
        this.loadAllUsersLimitations();
      },
      error: (error) => {
        console.error('Error al establecer limitaciones globales:', error);
        this.notificationService.showError('Error al establecer limitaciones globales');
      }
    });
  }
}
