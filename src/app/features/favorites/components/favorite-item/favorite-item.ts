import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Favorite } from '../../../../core/models/favorite';

@Component({
  selector: 'app-favorite-item',
  imports: [],
  templateUrl: './favorite-item.html',
  styleUrl: './favorite-item.css',
})
export class FavoriteItem {
  @Input() favorite!: Favorite;
  @Output() remove = new EventEmitter<Favorite>();

  onRemove(): void {
    this.remove.emit(this.favorite);
  }
}
