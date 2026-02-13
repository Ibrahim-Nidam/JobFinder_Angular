import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Job } from '../models/job';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobApi {
  private apiUrl = environment.usaJobsApi.url;
  private http = inject(HttpClient);

  searchJobs(keyword: string, location: string, page: number = 1): Observable<any> {
    let params = new HttpParams()
      .set('ResultsPerPage', '10')
      .set('Page', page.toString())
      .set('SortField', 'opendate')
      .set('SortDirection', 'Desc');

    if (keyword && keyword.trim()) {
      params = params.set('PositionTitle', keyword.trim());
    }

    if (location && location.trim()) {
      params = params.set('LocationName', location.trim());
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => {
        const searchResult = response.SearchResult || {};
        const items = searchResult.SearchResultItems || [];

        const mappedResults: Job[] = items.map((item: any) => this.mapToJob(item));

        return {
          results: mappedResults,
          total: searchResult.SearchResultCountAll || 0,
          currentPage: page,
          totalPages: parseInt(searchResult.UserArea?.NumberOfPages || '0')
        };
      })
    );
  }

  private mapToJob(item: any): Job {
    const descriptor = item.MatchedObjectDescriptor || {};
    const userArea = descriptor.UserArea?.Details || {};

    return {
      id: parseInt(item.MatchedObjectId) || 0,
      name: descriptor.PositionTitle || 'N/A',
      contents: userArea.JobSummary || descriptor.QualificationSummary || 'No description available',
      short_name: descriptor.PositionID || '',
      publication_date: descriptor.PublicationStartDate || new Date().toISOString(),
      locations: (descriptor.PositionLocation || []).map((loc: any) => ({
        name: loc.LocationName || loc.CityName || 'N/A'
      })),
      refs: {
        landing_page: descriptor.PositionURI || descriptor.ApplyURI?.[0] || ''
      },
      company: {
        name: descriptor.OrganizationName || descriptor.DepartmentName || userArea.SubAgencyName || 'N/A'
      },
      salary: descriptor.PositionRemuneration?.[0] ? {
        min: descriptor.PositionRemuneration[0].MinimumRange || '0',
        max: descriptor.PositionRemuneration[0].MaximumRange || '0',
        interval: descriptor.PositionRemuneration[0].Description || 'Per Year'
      } : undefined
    };
  }
}