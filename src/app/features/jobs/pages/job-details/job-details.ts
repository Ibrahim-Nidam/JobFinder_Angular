import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Footer } from '../../../../shared/components/footer/footer';
import { Header } from '../../../../shared/components/header/header';
import { Job } from '../../../../core/models/job';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { JobLocationPipe } from '../../../../shared/pipes/job-location.pipe';

@Component({
  selector: 'app-job-details',
  imports: [CommonModule, Header, Footer, DateFormatPipe, JobLocationPipe],
  templateUrl: './job-details.html',
  styleUrl: './job-details.css',
})
export class JobDetails {
  job: Job | null = null;
  private router = inject(Router);

  constructor() {
    const navigationState = this.router.getCurrentNavigation()?.extras.state as { job?: Job } | undefined;
    const historyState = history.state as { job?: Job } | undefined;

    this.job = navigationState?.job || historyState?.job || null;
  }

  onBackToSearch(): void {
    this.router.navigate(['/jobs/search']);
  }
}
