import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Favorite } from '../../../core/models/favorite';

@Injectable({
  providedIn: 'root',
})
export class Favorites {
  private apiUrl = 'http://localhost:3000/favoritesOffers';
  private http = inject(HttpClient);

  getFavorites(userId: number): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}`);
  }

  addFavorite(favorite: Favorite): Observable<Favorite> {
    return this.http.post<Favorite>(this.apiUrl, favorite);
  }

  removeFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkIfFavoriteExists(userId: number, offerId: number): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}&offerId=${offerId}`);
  }
}
