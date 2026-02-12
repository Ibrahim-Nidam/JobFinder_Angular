import { Routes } from "@angular/router";

export const JOBS_ROUTES: Routes = [
    {
        path: 'search',
        loadComponent: () => import('./pages/job-search/job-search')
        .then(m => m.JobSearch)
    },
    {
        path: 'details/:id',
        loadComponent: () => import('./pages/job-details/job-details')
        .then(m => m.JobDetails)
    },
    {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
    }
]