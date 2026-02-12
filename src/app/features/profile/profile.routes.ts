import { Routes } from "@angular/router";

export const PROFILE_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/profile-edit/profile-edit')
		.then(m => m.ProfileEdit)
	}
]