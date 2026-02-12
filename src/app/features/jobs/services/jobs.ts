import { Injectable } from '@angular/core';
import { JobApi } from '../../../core/services/job-api';
import { Observable } from 'rxjs';
import { Job } from '../../../core/models/job';

@Injectable({
  providedIn: 'root',
})
export class Jobs {
  private readonly ITEMS_PER_PAGE = 10;

  constructor(private jobApi: JobApi) {}

  searchJobs(keyword: string, location: string, page: number = 1): Observable<any> {
    return this.jobApi.searchJobs(keyword, location, page);
  }

  calculateTotalPages(totalItems: number, itemsPerPage: number = this.ITEMS_PER_PAGE): number {
    return Math.ceil(totalItems / itemsPerPage);
  }

  sortByDate(jobs: Job[], descending: boolean = true): Job[] {
    return [...jobs].sort((a, b) => {
      const dateA = new Date(a.publication_date).getTime();
      const dateB = new Date(b.publication_date).getTime();
      return descending ? dateB - dateA : dateA - dateB;
    });
  }

  getJobLocation(job: Job): string {
    return job.locations && job.locations.length > 0 ? job.locations[0].name : 'Non spécifié';
  }

  formatPublicationDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
