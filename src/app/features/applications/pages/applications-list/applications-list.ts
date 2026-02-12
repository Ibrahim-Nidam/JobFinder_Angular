import { Component, OnInit } from '@angular/core';
import { Application, ApplicationStatus } from '../../../../core/models/application';
import { Applications } from '../../services/applications';
import { Auth } from '../../../../core/services/auth';
import { Header } from '../../../../shared/components/header/header';
import { Footer } from '../../../../shared/components/footer/footer';
import { ApplicationItem } from '../../components/application-item/application-item';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-applications-list',
  imports: [Header, Footer, ApplicationItem, FormsModule],
  templateUrl: './applications-list.html',
  styleUrl: './applications-list.css',
})
export class ApplicationsList implements OnInit {
  applications: Application[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private applicationsService: Applications,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Utilisateur non authentifié';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.applicationsService.getApplications(currentUser.id).subscribe({
      next: (applications) => {
        this.applications = applications;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('load applications error', err);
        this.errorMessage = err.message || 'Erreur lors du chargement des candidatures';
        this.isLoading = false;
      },
    });
  }

  onUpdateStatus(payload: { id: number; status: ApplicationStatus }): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.applicationsService.updateApplicationStatus(payload.id, payload.status).subscribe({
      next: (updatedApp) => {
        const index = this.applications.findIndex((app) => app.id === payload.id);
        if (index !== -1) {
          this.applications[index] = updatedApp;
          this.successMessage = 'Statut mis à jour';
          setTimeout(() => (this.successMessage = ''), 3000);
        }
      },
      error: (err) => {
        console.error('update status error', err);
        this.errorMessage = err.message || 'Erreur lors de la mise à jour du statut';
      },
    });
  }

  onUpdateNotes(payload: { id: number; notes: string }): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.applicationsService.updateApplicationNotes(payload.id, payload.notes).subscribe({
      next: (updatedApp) => {
        const index = this.applications.findIndex((app) => app.id === payload.id);
        if (index !== -1) {
          this.applications[index] = updatedApp;
          this.successMessage = 'Notes mises à jour';
          setTimeout(() => (this.successMessage = ''), 3000);
        }
      },
      error: (err) => {
        console.error('update notes error', err);
        this.errorMessage = err.message || 'Erreur lors de la mise à jour des notes';
      },
    });
  }

  onDeleteApplication(id: number): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.applicationsService.deleteApplication(id).subscribe({
      next: () => {
        this.applications = this.applications.filter((app) => app.id !== id);
        this.successMessage = 'Candidature supprimée';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        console.error('delete application error', err);
        this.errorMessage = err.message || 'Erreur lors de la suppression';
      },
    });
  }

}
