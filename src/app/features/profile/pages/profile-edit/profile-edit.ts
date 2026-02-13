import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';
import { Storage } from '../../../../core/services/storage';
import { Footer } from '../../../../shared/components/footer/footer';
import { Header } from '../../../../shared/components/header/header';
import { User, UserAuth } from '../../../../core/models/user';
import { ProfileForm } from '../../components/profile-form/profile-form';

@Component({
  selector: 'app-profile-edit',
  imports: [Header, Footer, ProfileForm],
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.css',
})
export class ProfileEdit {
  user: UserAuth | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  private authService = inject(Auth);
  private storageService = inject(Storage);
  private router = inject(Router);

  constructor() {
    this.user = this.authService.getCurrentUser();
  }

  onSaveProfile(payload: Partial<User>): void {
    if (!this.user) {
      this.errorMessage = 'Utilisateur introuvable';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const currentEmail = this.user.email;
    const nextEmail = payload.email;
    const shouldCheckEmail = !!nextEmail && nextEmail !== currentEmail;

    const saveProfile = () => {
      this.authService.updateUser(this.user!.id, payload).subscribe({
        next: (updatedUser) => {
          const updatedAuth: UserAuth = {
            id: updatedUser.id ?? this.user!.id,
            nom: updatedUser.nom ?? payload.nom ?? this.user!.nom,
            prenom: updatedUser.prenom ?? payload.prenom ?? this.user!.prenom,
            email: updatedUser.email ?? payload.email ?? this.user!.email
          };

          this.storageService.saveUser(updatedAuth);
          this.user = updatedAuth;
          this.successMessage = 'Profil mis a jour';
          this.isLoading = false;
        },
        error: (err) => {
          console.error('update profile error', err);
          this.errorMessage = err.message || 'Erreur lors de la mise a jour du profil';
          this.isLoading = false;
        }
      });
    };

    if (shouldCheckEmail) {
      this.authService.checkEmailTakenForOtherUser(nextEmail!, this.user.id).subscribe({
        next: (taken) => {
          if (taken) {
            this.errorMessage = 'Cet email est deja utilise';
            this.isLoading = false;
            return;
          }

          saveProfile();
        },
        error: (err) => {
          console.error('email check error', err);
          this.errorMessage = err.message || 'Impossible de verifier l\'email';
          this.isLoading = false;
        }
      });
      return;
    }

    saveProfile();
  }

  onDeleteAccount(): void {
    if (!this.user) {
      this.errorMessage = 'Utilisateur introuvable';
      return;
    }

    const confirmed = window.confirm('Voulez-vous vraiment supprimer votre compte ?');
    if (!confirmed) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.deleteUser(this.user.id).subscribe({
      next: () => {
        this.authService.logout();
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('delete account error', err);
        this.errorMessage = err.message || 'Erreur lors de la suppression du compte';
        this.isLoading = false;
      }
    });
  }
}