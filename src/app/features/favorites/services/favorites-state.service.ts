import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Auth } from '../../../core/services/auth';
import { Job } from '../../../core/models/job';
import { Favorite } from '../../../core/models/favorite';
import * as FavoritesActions from '../store/favorites.actions';
import { selectFavorites } from '../store/favorites.selectors';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FavoritesStateService {
  private store = inject(Store);
  private authService = inject(Auth);
  private favorites$ = this.store.select(selectFavorites);


  toggleFavorite(job: Job): Observable<boolean> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be authenticated to toggle favorites');
    }

    return this.favorites$.pipe(
      take(1),
      map((favorites) => {
        const existingFavorite = favorites.find((f) => f.offerId === job.id);

        if (existingFavorite && existingFavorite.id) {
          this.store.dispatch(FavoritesActions.removeFavorite({ id: existingFavorite.id }));
          return false;
        } else {
          const favorite: Favorite = {
            userId: currentUser.id,
            offerId: job.id,
            title: job.name,
            company: job.company.name,
            location:
              job.locations && job.locations.length > 0
                ? job.locations[0].name
                : 'not specified',
          };

          this.store.dispatch(FavoritesActions.addFavorite({ favorite }));
          return true;
        }
      })
    );
  }
}