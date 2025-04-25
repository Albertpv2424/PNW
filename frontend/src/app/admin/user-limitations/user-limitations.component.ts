import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserLimitationsService } from '../../services/user-limitations.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-limitations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './user-limitations.component.html',
  styleUrls: ['./user-limitations.component.css', '../shared/admin-shared.css']
})
export class UserLimitationsComponent implements OnInit {
  usersLimitations: any[] = [];
  filteredUsers: any[] = [];
  loading = true;
  selectedUser: any = null;
  editMode = false;
  searchTerm = '';
  
  // Valores para editar
  maxDailyBets: number = 5;
  maxDailyBettingTime: number = 3600; // 1 hora en segundos

  // Valores para límites globales
  globalLimitations = {
    max_daily_bets: 5,
    max_daily_betting_time: 3600
  };
  showGlobalLimitationsModal = false;

  constructor(
    private userLimitationsService: UserLimitationsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadAllUsersLimitations();
  }

  loadAllUsersLimitations(): void {
    this.loading = true;
    this.userLimitationsService.getAllUsersLimitations().subscribe({
      next: (data) => {
        this.usersLimitations = data;
        this.filteredUsers = [...this.usersLimitations];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar limitaciones:', error);
        this.notificationService.showError('Error al cargar las limitaciones de usuarios');
        this.loading = false;
      }
    });
  }

  filterUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.usersLimitations];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.usersLimitations.filter(user => 
      user.username.toLowerCase().includes(term) || 
      user.email?.toLowerCase().includes(term)
    );
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.maxDailyBets = user.max_daily_bets;
    this.maxDailyBettingTime = user.max_daily_betting_time;
    this.editMode = false;
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  updateLimitations(): void {
    if (!this.selectedUser) return;

    const limitations = {
      max_daily_bets: this.maxDailyBets,
      max_daily_betting_time: this.maxDailyBettingTime
    };

    this.userLimitationsService.updateUserLimitations(this.selectedUser.username, limitations).subscribe({
      next: (response) => {
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

    if (confirm(`¿Estás seguro de que deseas reiniciar los contadores de ${this.selectedUser.username}?`)) {
      this.userLimitationsService.resetUserLimitations(this.selectedUser.username).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Contadores reiniciados correctamente');
          this.loadAllUsersLimitations();
        },
        error: (error) => {
          console.error('Error al reiniciar contadores:', error);
          this.notificationService.showError('Error al reiniciar los contadores');
        }
      });
    }
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  isLimitationsEnabled(user: any): boolean {
    // Si el límite es muy alto, consideramos que está deshabilitado
    return user.max_daily_bets < 999999;
  }

  toggleLimitations(user: any, event: any): void {
    const checked = event?.target?.checked;
    this.userLimitationsService.toggleUserLimitations(user.username, checked).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(response.message);
        this.loadAllUsersLimitations();
        
        // Si el usuario seleccionado es el que se está modificando, actualizar la selección
        if (this.selectedUser && this.selectedUser.username === user.username) {
          this.selectedUser.max_daily_bets = response.max_daily_bets;
          this.selectedUser.max_daily_betting_time = response.max_daily_betting_time;
          this.maxDailyBets = response.max_daily_bets;
          this.maxDailyBettingTime = response.max_daily_betting_time;
        }
      },
      error: (error) => {
        console.error('Error al cambiar estado de restricciones:', error);
        this.notificationService.showError('Error al cambiar el estado de las restricciones');
      }
    });
  }

  openGlobalLimitationsModal(): void {
    this.userLimitationsService.getDefaultLimitations().subscribe({
      next: (data) => {
        this.globalLimitations.max_daily_bets = data.max_daily_bets;
        this.globalLimitations.max_daily_betting_time = data.max_daily_betting_time;
        this.showGlobalLimitationsModal = true;
      },
      error: (error) => {
        console.error('Error al cargar limitaciones predeterminadas:', error);
        this.notificationService.showError('Error al cargar las limitaciones predeterminadas');
        
        // Usar valores predeterminados en caso de error
        this.globalLimitations.max_daily_bets = 5;
        this.globalLimitations.max_daily_betting_time = 3600;
        this.showGlobalLimitationsModal = true;
      }
    });
  }

  closeGlobalLimitationsModal(): void {
    this.showGlobalLimitationsModal = false;
  }

  saveGlobalLimitations(): void {
    this.userLimitationsService.setGlobalLimitations(this.globalLimitations).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(`Restricciones globales actualizadas para ${response.updated_users} usuarios`);
        this.closeGlobalLimitationsModal();
        this.loadAllUsersLimitations();
      },
      error: (error) => {
        console.error('Error al establecer restricciones globales:', error);
        this.notificationService.showError('Error al establecer restricciones globales');
      }
    });
  }
}
