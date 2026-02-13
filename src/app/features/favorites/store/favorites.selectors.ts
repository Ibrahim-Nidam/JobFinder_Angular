import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FavoritesState } from "./favorites.state";

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectFavorites = createSelector(selectFavoritesState, (state) => state.favorites);

export const selectFavoritesLoading = createSelector(selectFavoritesState, (state) => state.loading);

export const selectFavoritesError = createSelector(selectFavoritesState, (state) => state.error);

export const selectIsFavorite = (offerId: number) => 
    createSelector(selectFavorites, (favorites) => 
        favorites.some((favorite) => favorite.offerId === offerId)
);