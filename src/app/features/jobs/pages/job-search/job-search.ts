import { Component, inject } from '@angular/core';
import { JobItem } from '../../components/job-item/job-item';
import { Job } from '../../../../core/models/job';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { Header } from "../../../../shared/components/header/header";
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Footer } from '../../../../shared/components/footer/footer';
import { Jobs } from '../../services/jobs';
import { SearchFilters, SearchCriteria } from '../../components/search-filters/search-filters';
import { Applications } from '../../../applications/services/applications';
import { Auth } from '../../../../core/services/auth';
import { Favorite } from '../../../../core/models/favorite';
import { Application } from '../../../../core/models/application';
import { Store } from '@ngrx/store';
import * as FavoritesActions from '../../../favorites/store/favorites.actions';
import { selectFavorites } from '../../../favorites/store/favorites.selectors';
import { FavoritesStateService } from '../../../favorites/services/favorites-state.service';

@Component({
  selector: 'app-job-search',
  imports: [JobItem, LoadingSpinner, Header, Pagination, Footer, SearchFilters],
  templateUrl: './job-search.html',
  styleUrl: './job-search.css',
})
export class JobSearch {
  jobs: Job[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  hasSearched: boolean = false;
  favorites: Favorite[] = [];
  applications: Application[] = [];
  
  private currentKeyword: string = '';
  private currentLocation: string = '';
  private jobService = inject(Jobs);
  private applicationsService = inject(Applications);
  private authService = inject(Auth);
  private store = inject(Store);
  private favoritesStateService = inject(FavoritesStateService);

  ngOnInit(): void {
    this.loadJobs();
    this.loadFavorites();
    this.loadApplications();
  }

  loadFavorites(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.store.dispatch(FavoritesActions.loadFavorites({ userId: currentUser.id }));
      this.store.select(selectFavorites).subscribe((favorites) => {
        this.favorites = favorites;
      });
    }
  }

  loadApplications(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.applicationsService.getApplications(currentUser.id).subscribe({
        next: (applications) => {
          this.applications = applications;
        },
        error: (err) => {
          console.error('Error loading applications', err);
        }
      });
    }
  }

  onSearch(criteria: SearchCriteria): void {
    this.currentKeyword = criteria.keyword;
    this.currentLocation = criteria.location;
    this.currentPage = 1;
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.hasSearched = true;

    this.jobService.searchJobs(this.currentKeyword, this.currentLocation, this.currentPage).subscribe({
      next: (response) => {
        this.jobs = response.results;
        
        this.totalPages = this.jobService.calculateTotalPages(response.total || 0);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('load jobs error', err);
        this.errorMessage = 'Erreur lors du chargement des offres';
        this.isLoading = false;
        this.jobs = [];
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadJobs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onAddToFavorites(job: Job): void {
    const currentUser = this.authService.getCurrentUser();
    if(!currentUser){
      this.errorMessage = 'Vous devez être connecté pour ajouter un favori';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    try {
      this.favoritesStateService.toggleFavorite(job).subscribe({
        next: (added) => {
          if (added) {
            this.successMessage = 'Offre ajoutée aux favoris';
          } else {
            this.successMessage = 'Offre retirée des favoris';
          }
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Erreur lors de la modification du favori';
          setTimeout(() => (this.errorMessage = ''), 3000);
        }
      });
    } catch (err: any) {
      this.errorMessage = err.message || 'Erreur lors de la modification du favori';
      setTimeout(() => (this.errorMessage = ''), 3000);
    }
  }

  onTrackApplication(job: Job): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Vous devez être connecté pour suivre une candidature';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.applicationsService.toggleTrackedApplication(currentUser.id, job).subscribe({
      next: (action) => {
        if (action === 'added') {
          this.loadApplications(); 
          this.successMessage = 'Candidature ajoutée à votre suivi';
        } else {
          this.loadApplications();
          this.successMessage = 'Candidature retirée du suivi';
        }
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        console.error('toggle application error', err);
        this.errorMessage = err.message || 'Erreur lors de la modification de la candidature';
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }

  isFavorite(job: Job): boolean {
    return this.favorites.some(f => f.offerId === job.id);
  }

  isTracked(job: Job): boolean {
    return this.applications.some(app => app.offerId === job.id);
  }
}
