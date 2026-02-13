import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public authService = inject(Auth);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/jobs/search']);
  }
}
