import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UserAuth } from '../../../../core/models/user';

@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css',
})
export class ProfileForm implements OnChanges {
  @Input() user: UserAuth | null = null;
  @Input() isLoading: boolean = false;
  @Output() save = new EventEmitter<Partial<User>>();
  @Output() delete = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        nom: ['', [Validators.required, Validators.minLength(2)]],
        prenom: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.minLength(6)]],
        confirmPassword: ['']
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.form.patchValue({
        nom: this.user.nom,
        prenom: this.user.prenom,
        email: this.user.email,
        password: '',
        confirmPassword: ''
      });
    }
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value as string;
    const confirmPassword = form.get('confirmPassword')?.value as string;

    if (password && password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nom, prenom, email, password } = this.form.value;
    const payload: Partial<User> = { nom, prenom, email };

    if (password && password.trim()) {
      payload.password = password.trim();
    }

    this.save.emit(payload);
  }

  onDelete(): void {
    this.delete.emit();
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  hasPasswordMismatch(): boolean {
    return !!(this.form.hasError('passwordMismatch') && this.form.get('confirmPassword')?.touched);
  }
}
