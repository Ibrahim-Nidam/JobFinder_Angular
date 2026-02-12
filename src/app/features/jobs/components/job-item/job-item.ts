import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Job } from '../../../../core/models/job';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-job-item',
  imports: [DecimalPipe],
  templateUrl: './job-item.html',
  styleUrl: './job-item.css',
})
export class JobItem {
  @Input() job!: Job;
  @Input() isFavorite: boolean = false;
  
  @Output() addToFavorites = new EventEmitter<Job>();
  @Output() trackApplication = new EventEmitter<Job>();

  constructor(public authService: Auth){}

  onAddToFavorites() :void {
    this.addToFavorites.emit(this.job);
  }

  onTrackApplication(): void {
    this.trackApplication.emit(this.job);
  }

  getLocation(): string {
    return this.job.locations && this.job.locations.length > 0 ? this.job.locations[0].name : 'not specified';
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
