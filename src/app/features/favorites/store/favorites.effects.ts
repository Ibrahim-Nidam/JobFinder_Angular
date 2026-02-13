import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Favorites } from "../services/favorites";
import * as FavoriteActions from './favorites.actions'
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { selectFavorites } from "./favorites.selectors";

@Injectable()
export class FavoritesEffects {
    private actions$ = inject(Actions);
    private favoritesService = inject(Favorites);
    private store = inject(Store);

    loadFavorites$ = createEffect(() => 
        this.actions$.pipe(
            ofType(FavoriteActions.loadFavorites),
            mergeMap(({ userId }) => 
                this.favoritesService.getFavorites(userId).pipe(
                    map((favorites) => FavoriteActions.loadFavoritesSuccess({ favorites })),
                    catchError((error) => 
                        of(FavoriteActions.loadFavoritesFailure({ error: error.message || 'Load failed' }))
                    )
                )
            )
        )
    );

    addFavorite$ = createEffect(() => 
        this.actions$.pipe(
            ofType(FavoriteActions.addFavorite),
            withLatestFrom(this.store.select(selectFavorites)),
            switchMap(([{ favorite }, existingFavorites]) => {
                const isDuplicate = existingFavorites.some(
                    (f) => f.offerId === favorite.offerId && f.userId === favorite.userId
                );

                if (isDuplicate) {
                    return of(FavoriteActions.addFavoriteFailure({ error: 'Cette offre est déjà dans vos favoris' }));
                }

                return this.favoritesService.addFavorite(favorite).pipe(
                    map((created) => FavoriteActions.addFavoriteSuccess({ favorite: created })),
                    catchError((error) => 
                        of(FavoriteActions.addFavoriteFailure({ error: error.message || 'Add failed' }))
                    )
                );
            })
        )
    );

    removeFavorite$ = createEffect(() => 
        this.actions$.pipe(
            ofType(FavoriteActions.removeFavorite),
            switchMap(({ id }) => 
                this.favoritesService.removeFavorite(id).pipe(
                    map(() => FavoriteActions.removeFavoriteSuccess({ id })),
                    catchError((error) => 
                        of(FavoriteActions.removeFavoriteFailure({ error: error.message || 'Remove failed' }))
                    )
                )
            )
        )
    );

    handleFavoritesMessages$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(
                    FavoriteActions.addFavoriteSuccess,
                    FavoriteActions.addFavoriteFailure,
                    FavoriteActions.removeFavoriteSuccess,
                    FavoriteActions.removeFavoriteFailure
                ),
                map((action) => {
                    if ('favorite' in action || 'id' in action) {
                        if ('favorite' in action) {
                            console.log('Favorite added successfully:', action.favorite);
                        } else if ('id' in action) {
                            console.log('Favorite removed successfully:', action.id);
                        }
                    } else if ('error' in action) {
                        console.error('Favorites action failed:', action.error);
                    }
                })
            ),
        { dispatch: false }
    );
}