import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../../core/services/auth';
import { passwordMatchValidator } from '../../../../core/models/user';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  constructor() {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: passwordMatchValidator
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const { nom, prenom, email, password } = this.registerForm.value;

    this.authService.checkEmailExists(email).subscribe({
      next: (exists) => {
        if (exists) {
          this.errorMessage = 'Cet email est déjà utilisé';
          this.isLoading = false;
          return;
        }

        const newUser = { nom, prenom, email, password };

        this.authService.register(newUser).subscribe({
          next: (user) => {
            this.authService.login(email, password).subscribe({
              next: () => {
                this.router.navigate(['/jobs/search']);
              },
              error: (err) => {
                this.errorMessage = 'Connexion automatique impossible';
                console.error(err);
              },
              complete: () => this.isLoading = false
            });
          },
          error: (err) => {
            this.errorMessage = 'Une erreur est survenue lors de l\'inscription';
            console.error(err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Impossible de vérifier l\'email';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  hasPasswordMismatch(): boolean {
    return !!(this.registerForm.hasError('passwordMismatch') && 
             this.registerForm.get('confirmPassword')?.touched);
  }
}
