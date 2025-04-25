import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

interface PrizeRedemption {
  id: number;
  usuari_nick: string;
  email: string;
  premio_titulo: string;
  premio_descripcion: string;
  cost: number;
  data_reclamat: string;
  data_limit: string;
  usado: boolean;
}

@Component({
  selector: 'app-prize-redemptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prize-redemptions.component.html',
  styleUrls: ['./prize-redemptions.component.css', '../shared/admin-shared.css']
})
export class PrizeRedemptionsComponent implements OnInit {
  redemptions: PrizeRedemption[] = [];
  filteredRedemptions: PrizeRedemption[] = [];
  isLoading = true;
  searchTerm = '';
  statusFilter = 'all'; // 'all', 'used', 'unused'

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadRedemptions();
  }

  loadRedemptions(): void {
    this.isLoading = true;
    this.notificationService.showInfo('Cargando canjes de premios...');

    this.http.get<any>(`${environment.apiUrl}/admin/prize-redemptions`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response) => {
        console.log('Raw API response:', response);

        // Check if the response has a data property (new API format)
        if (response && response.data) {
          this.redemptions = response.data.map((item: any) => {
            // Ensure the 'usado' property is a boolean
            return {
              ...item,
              usado: item.usado === true || item.usado === 1 || item.usado === '1'
            };
          });
          console.log('Processed redemptions:', this.redemptions);
        } else {
          // Old API format
          this.redemptions = response.map((item: any) => {
            return {
              ...item,
              usado: item.usado === true || item.usado === 1 || item.usado === '1'
            };
          });
          console.log('Processed redemptions (old format):', this.redemptions);
        }

        this.applyFilters();
        this.isLoading = false;

        if (this.redemptions.length === 0) {
          this.notificationService.showInfo('No se encontraron canjes de premios');
        } else {
          this.notificationService.showSuccess(`Se cargaron ${this.redemptions.length} canjes de premios`);
        }
      },
      error: (error) => {
        console.error('Error loading prize redemptions:', error);
        this.notificationService.showError('Error al cargar los canjes de premios');
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    console.log('Applying filters. Status filter:', this.statusFilter, 'Search term:', this.searchTerm);
    console.log('Total redemptions before filtering:', this.redemptions.length);

    let filtered = [...this.redemptions];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(redemption => {
        const nickMatch = redemption.usuari_nick?.toLowerCase().includes(term) || false;
        const emailMatch = redemption.email?.toLowerCase().includes(term) || false;
        const titleMatch = redemption.premio_titulo?.toLowerCase().includes(term) || false;

        return nickMatch || emailMatch || titleMatch;
      });
      console.log('After search filter:', filtered.length);
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      const isUsed = this.statusFilter === 'used';
      console.log('Filtering by status:', this.statusFilter, 'isUsed:', isUsed);

      filtered = filtered.filter(redemption => {
        // Convert redemption.usado to boolean regardless of its original type
        const redemptionUsed = Boolean(redemption.usado);
        console.log(`Redemption ID ${redemption.id}, usado:`, redemption.usado, 'converted:', redemptionUsed);
        return redemptionUsed === isUsed;
      });

      console.log('After status filter:', filtered.length);
    }

    this.filteredRedemptions = filtered;
    console.log('Final filtered redemptions:', this.filteredRedemptions.length);
  }

  updateRedemptionStatus(redemption: PrizeRedemption, status: boolean): void {
    // Show loading notification
    this.notificationService.showInfo('Actualizando estado del premio...');

    this.http.post(`${environment.apiUrl}/admin/prize-redemptions/${redemption.id}/verify`,
      { verified: status },
      { headers: this.authService.getAuthHeaders() }
    ).subscribe({
      next: (response: any) => {
        redemption.usado = status;
        this.notificationService.showSuccess(`Premio marcado como ${status ? 'usado' : 'no usado'}`);
        // Re-apply filters to update the view
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error updating redemption status:', error);

        // Extract more detailed error information if available
        let errorMessage = 'Error al actualizar el estado del premio';
        if (error.error && error.error.message) {
          errorMessage += ': ' + error.error.message;
        } else if (error.error && typeof error.error === 'string') {
          errorMessage += ': ' + error.error;
        }

        this.notificationService.showError(errorMessage);
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(status: string): void {
    console.log('Status filter changed to:', status);
    this.statusFilter = status;
    this.applyFilters();
  }
}
