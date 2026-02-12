import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/jobs/search',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes')
        .then(m => m.AUTH_ROUTES)
    },
    {
        path: 'jobs',
        loadChildren: () => import('./features/jobs/jobs.routes')
        .then(m => m.JOBS_ROUTES)
    },
    {
        path: 'applications',
        canActivate: [authGuard],
        loadChildren: () => import('./features/applications/applications.routes')
        .then(m => m.APPLICATIONS_ROUTES)
    },
    {
        path: 'profile',
        canActivate: [authGuard],
        loadChildren: () => import('./features/profile/profile.routes')
        .then(m => m.PROFILE_ROUTES)
    },
    {
        path: 'favorites',
        canActivate: [authGuard],
        loadChildren: () => import('./features/favorites/favorites.routes')
        .then(m => m.FAVORITES_ROUTES)
    },
    {
        path: '**',
        redirectTo: '/jobs/search'
    }
];
