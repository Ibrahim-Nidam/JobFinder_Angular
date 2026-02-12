import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Footer } from '../../../../shared/components/footer/footer';
import { Header } from '../../../../shared/components/header/header';
import { Job } from '../../../../core/models/job';

@Component({
  selector: 'app-job-details',
  imports: [CommonModule, Header, Footer],
  templateUrl: './job-details.html',
  styleUrl: './job-details.css',
})
export class JobDetails {
  job: Job | null = null;

  constructor(private router: Router) {
    const navigationState = this.router.getCurrentNavigation()?.extras.state as { job?: Job } | undefined;
    const historyState = history.state as { job?: Job } | undefined;

    this.job = navigationState?.job || historyState?.job || null;
  }

  onBackToSearch(): void {
    this.router.navigate(['/jobs/search']);
  }

  getLocation(): string {
    return this.job?.locations && this.job.locations.length > 0
      ? this.job.locations[0].name
      : 'Non specifie';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
