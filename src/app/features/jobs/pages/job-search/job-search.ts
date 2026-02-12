import { Component } from '@angular/core';
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
  
  private currentKeyword: string = '';
  private currentLocation: string = '';

  constructor(
    private jobService: Jobs,
    private applicationsService: Applications,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.loadJobs();
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
    console.log('add to favorites', job);
    
  }

  onTrackApplication(job: Job): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Vous devez être connecté pour suivre une candidature';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.applicationsService.trackApplication(currentUser.id, job).subscribe({
      next: (result) => {
        if (result === 'exists') {
          this.errorMessage = 'Cette candidature est déjà dans votre suivi';
          setTimeout(() => (this.errorMessage = ''), 3000);
          return;
        }

        this.successMessage = 'Candidature ajoutée à votre suivi';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        console.error('track application error', err);
        this.errorMessage = err.message || 'Erreur lors de l\'ajout de la candidature';
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }

  isFavorite(job: Job): boolean {
    return false;
  }
}
