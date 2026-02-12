import { Routes } from "@angular/router";

export const APPLICATIONS_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/applications-list/applications-list')
		.then(m => m.ApplicationsList)
	}
]