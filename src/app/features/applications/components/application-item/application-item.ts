import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Application, ApplicationStatus } from '../../../../core/models/application';
import { StatusBadge } from '../status-badge/status-badge';

@Component({
  selector: 'app-application-item',
  imports: [StatusBadge, FormsModule],
  templateUrl: './application-item.html',
  styleUrl: './application-item.css',
})
export class ApplicationItem {
  @Input() application!: Application;
  @Output() updateStatus = new EventEmitter<{ id: number; status: ApplicationStatus }>();
  @Output() updateNotes = new EventEmitter<{ id: number; notes: string }>();
  @Output() delete = new EventEmitter<number>();

  isEditingNotes: boolean = false;
  editedNotes: string = '';

  statuses: { value: ApplicationStatus; label: string }[] = [
    { value: 'en_attente', label: 'En attente' },
    { value: 'accepte', label: 'Accepté' },
    { value: 'refuse', label: 'Refusé' },
  ];

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as ApplicationStatus;
    this.updateStatus.emit({ id: this.application.id!, status: newStatus });
  }

  startEditNotes(): void {
    this.isEditingNotes = true;
    this.editedNotes = this.application.notes || '';
  }

  cancelEditNotes(): void {
    this.isEditingNotes = false;
    this.editedNotes = '';
  }

  saveNotes(): void {
    if (this.editedNotes !== this.application.notes) {
      this.updateNotes.emit({ id: this.application.id!, notes: this.editedNotes });
    }
    this.isEditingNotes = false;
  }

  onDelete(): void {
    if (confirm('Voulez-vous vraiment supprimer cette candidature ?')) {
      this.delete.emit(this.application.id!);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
