import { AbstractControl, ValidationErrors } from '@angular/forms';

export interface User {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    password?: string;
}

export interface UserAuth {
    id: number;
    nom: string;
    prenom: string;
    email: string;
}

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value as string;
    const confirmPassword = control.get('confirmPassword')?.value as string;

    if (password && password !== confirmPassword) {
        return { passwordMismatch: true };
    }

    return null;
}