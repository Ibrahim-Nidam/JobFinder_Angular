import { Component } from '@angular/core';
import { JobItem } from '../../components/job-item/job-item';
import { Job } from '../../../../core/models/job';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { Header } from "../../../../shared/components/header/header";
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Footer } from '../../../../shared/components/footer/footer';
import { Jobs } from '../../services/jobs';
import { SearchFilters, SearchCriteria } from '../../components/search-filters/search-filters';

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
  currentPage: number = 1;
  totalPages: number = 0;
  hasSearched: boolean = false;
  
  private currentKeyword: string = '';
  private currentLocation: string = '';

  constructor(private jobService: Jobs) {}

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
    console.log('Track application:', job);
  }

  isFavorite(job: Job): boolean {
    return false;
  }
}
