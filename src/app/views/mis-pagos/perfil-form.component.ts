import { Component, EventEmitter, Input, Output, OnChanges, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../auth/application/services/auth.service';
import { AuthUser } from '../../auth/domain/models/auth.model';

@Component({
  selector: 'app-perfil-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './perfil-form.component.html',
})
export class PerfilFormComponent implements OnChanges {
  @Input({ required: true }) cuenta!: AuthUser;
  @Output() actualizado = new EventEmitter<AuthUser>();
  @Output() cancelado = new EventEmitter<void>();

  private auth = inject(AuthService);

  nombre = '';
  apellido = '';
  ci = '';
  telefono = '';

  cambiarPassword = false;
  currentPassword = '';
  password = '';
  passwordConfirmation = '';

  guardando = signal(false);
  error = signal<string | null>(null);
  exito = signal(false);

  ngOnChanges(): void {
    this.nombre = this.cuenta.nombre ?? '';
    this.apellido = this.cuenta.apellido ?? '';
    this.ci = this.cuenta.ci ?? '';
    this.telefono = this.cuenta.telefono ?? '';
  }

  guardar(): void {
    if (this.cambiarPassword && this.password !== this.passwordConfirmation) {
      this.error.set('Las contraseñas nuevas no coinciden.');
      return;
    }

    this.guardando.set(true);
    this.error.set(null);
    this.exito.set(false);

    this.auth.updatePerfil({
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      ci: this.ci.trim(),
      telefono: this.telefono.trim(),
      ...(this.cambiarPassword ? {
        current_password: this.currentPassword,
        password: this.password,
        password_confirmation: this.passwordConfirmation,
      } : {}),
    }).subscribe({
      next: user => {
        this.guardando.set(false);
        this.exito.set(true);
        this.cambiarPassword = false;
        this.currentPassword = '';
        this.password = '';
        this.passwordConfirmation = '';
        this.actualizado.emit(user);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando.set(false);
        this.error.set(this.extraerError(err));
      },
    });
  }

  cancelar(): void {
    this.cancelado.emit();
  }

  private extraerError(err: HttpErrorResponse): string {
    const errors = err.error?.errors;
    if (errors) {
      const primero = Object.values(errors)[0];
      if (Array.isArray(primero) && primero.length) return String(primero[0]);
    }
    return err.error?.error ?? 'No se pudo actualizar el perfil.';
  }
}
