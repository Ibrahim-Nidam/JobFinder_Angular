import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Job } from '../../../../core/models/job';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { JobLocationPipe } from '../../../../shared/pipes/job-location.pipe';

@Component({
  selector: 'app-job-item',
  imports: [DecimalPipe, DateFormatPipe, JobLocationPipe],
  templateUrl: './job-item.html',
  styleUrl: './job-item.css',
})
export class JobItem {
  @Input() job!: Job;
  @Input() isFavorite: boolean = false;
  @Input() isTracked: boolean = false;
  
  @Output() addToFavorites = new EventEmitter<Job>();
  @Output() trackApplication = new EventEmitter<Job>();

  public authService = inject(Auth);
  private router = inject(Router);

  onAddToFavorites() :void {
    this.addToFavorites.emit(this.job);
  }

  onTrackApplication(): void {
    this.trackApplication.emit(this.job);
  }

  onViewDetails(): void {
    this.router.navigate(['/jobs/details', this.job.id], {
      state: { job: this.job }
    });
  }
}
