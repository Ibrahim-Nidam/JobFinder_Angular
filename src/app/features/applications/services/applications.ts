import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { Application, ApplicationStatus } from '../../../core/models/application';
import { Job } from '../../../core/models/job';

@Injectable({
  providedIn: 'root',
})
export class Applications {
  private apiUrl = 'http://localhost:3000/applications';
  private http = inject(HttpClient);

  getApplications(userId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}`);
  }

  getApplicationById(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${id}`);
  }

  addApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, application);
  }

  updateApplicationStatus(id: number, status: ApplicationStatus): Observable<Application> {
    return this.http.patch<Application>(`${this.apiUrl}/${id}`, { status });
  }

  updateApplicationNotes(id: number, notes: string): Observable<Application> {
    return this.http.patch<Application>(`${this.apiUrl}/${id}`, { notes });
  }

  updateApplication(id: number, updates: Partial<Application>): Observable<Application> {
    return this.http.patch<Application>(`${this.apiUrl}/${id}`, updates);
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkIfApplicationExists(userId: number, offerId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}&offerId=${offerId}`);
  }

  trackApplication(userId: number, job: Job, apiSource: string = 'usajobs'): Observable<'created' | 'exists'> {
    return this.checkIfApplicationExists(userId, job.id).pipe(
      switchMap((existingApps) => {
        if (existingApps.length > 0) {
          return of('exists' as const);
        }

        const newApplication: Application = {
          userId,
          offerId: job.id,
          apiSource,
          title: job.name,
          company: job.company.name,
          location: job.locations && job.locations.length > 0 ? job.locations[0].name : 'Non specifie',
          url: job.refs.landing_page,
          status: 'en_attente',
          notes: '',
          dateAdded: new Date().toISOString(),
        };

        return this.addApplication(newApplication).pipe(map(() => 'created' as const));
      })
    );
  }

  toggleTrackedApplication(userId: number, job: Job, apiSource: string = 'usajobs'): Observable<'added' | 'removed'> {
    return this.checkIfApplicationExists(userId, job.id).pipe(
      switchMap((existingApps) => {
        if (existingApps.length > 0) {
          return this.deleteApplication(existingApps[0].id!).pipe(
            map(() => 'removed' as const)
          );
        }

        const newApplication: Application = {
          userId,
          offerId: job.id,
          apiSource,
          title: job.name,
          company: job.company.name,
          location: job.locations && job.locations.length > 0 ? job.locations[0].name : 'Non specifie',
          url: job.refs.landing_page,
          status: 'en_attente',
          notes: '',
          dateAdded: new Date().toISOString(),
        };

        return this.addApplication(newApplication).pipe(
          map(() => 'added' as const)
        );
      })
    );
  }
}
