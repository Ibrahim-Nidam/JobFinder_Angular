import { inject, Injectable } from '@angular/core';
import { JobApi } from '../../../core/services/job-api';
import { Observable } from 'rxjs';
import { Job } from '../../../core/models/job';

@Injectable({
  providedIn: 'root',
})
export class Jobs {
  private readonly ITEMS_PER_PAGE = 10;
  private jobApi = inject(JobApi);

  searchJobs(keyword: string, location: string, page: number = 1): Observable<any> {
    return this.jobApi.searchJobs(keyword, location, page);
  }

  calculateTotalPages(totalItems: number, itemsPerPage: number = this.ITEMS_PER_PAGE): number {
    return Math.ceil(totalItems / itemsPerPage);
  }
}
