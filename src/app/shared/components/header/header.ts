import { Component } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(public authService: Auth) {}
}
