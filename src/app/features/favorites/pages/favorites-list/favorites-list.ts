import { Component, inject, OnInit } from '@angular/core';
import { selectFavorites, selectFavoritesError, selectFavoritesLoading } from '../../store/favorites.selectors';
import { Footer } from '../../../../shared/components/footer/footer';
import { Header } from '../../../../shared/components/header/header';
import { Store } from '@ngrx/store';
import { Auth } from '../../../../core/services/auth';
import * as FavoriteActions from '../../store/favorites.actions';
import { Favorite } from '../../../../core/models/favorite';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { FavoriteItem } from '../../components/favorite-item/favorite-item';

@Component({
  selector: 'app-favorites-list',
  imports: [Header, Footer, AsyncPipe, LoadingSpinner, FavoriteItem],
  templateUrl: './favorites-list.html',
  styleUrl: './favorites-list.css',
})
export class FavoritesList implements OnInit {

  favorites$!: Observable<Favorite[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  private store = inject(Store);
  private authService = inject(Auth);

  constructor() {
    this.favorites$ = this.store.select(selectFavorites);
    this.loading$ = this.store.select(selectFavoritesLoading);
    this.error$ = this.store.select(selectFavoritesError);
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if(currentUser){
      this.store.dispatch(FavoriteActions.loadFavorites({ userId: currentUser.id }));
    }
  }

  onRemoveFavorite(favorite: Favorite): void {
    if(favorite.id){
      this.store.dispatch(FavoriteActions.removeFavorite({ id: favorite.id }));
    }
  }
}
