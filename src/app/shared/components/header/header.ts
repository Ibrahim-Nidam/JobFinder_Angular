import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(public authService: Auth, private router: Router) {}

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/jobs/search']);
  }
}
