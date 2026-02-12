import { Component, Input } from '@angular/core';
import { ApplicationStatus } from '../../../../core/models/application';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadge {
  @Input() status!: ApplicationStatus;

  get badgeClasses(): string {
    const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';
    
    switch (this.status) {
      case 'en_attente':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'accepte':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'refuse':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  get statusLabel(): string {
    switch (this.status) {
      case 'en_attente':
        return 'En attente';
      case 'accepte':
        return 'Accepté';
      case 'refuse':
        return 'Refusé';
      default:
        return this.status;
    }
  }
}
