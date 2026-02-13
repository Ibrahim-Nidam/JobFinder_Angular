import { createReducer, on } from "@ngrx/store";
import { initialFavoritesState } from "./favorites.state";
import * as FavoriteActions from "./favorites.actions";

export const favoritesReducer = createReducer(
    initialFavoritesState,

    on(FavoriteActions.loadFavorites, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(FavoriteActions.loadFavoritesSuccess, (state, { favorites }) => ({
        ...state,
        favorites,
        loading: false,
        error: null
    })),

    on(FavoriteActions.loadFavoritesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(FavoriteActions.addFavorite, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(FavoriteActions.addFavoriteSuccess, (state, { favorite }) => ({
    ...state,
    favorites: [...state.favorites, favorite],
    loading: false,
    error: null
  })),

  on(FavoriteActions.addFavoriteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(FavoriteActions.removeFavorite, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(FavoriteActions.removeFavoriteSuccess, (state, { id }) => ({
    ...state,
    favorites: state.favorites.filter((favorite) => favorite.id !== id),
    loading: false,
    error: null
  })),

  on(FavoriteActions.removeFavoriteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
)