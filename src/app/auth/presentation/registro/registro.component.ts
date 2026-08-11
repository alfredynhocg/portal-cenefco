import { Component, AfterViewInit, ElementRef, ViewChild, inject, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../application/services/auth.service';
import { GoogleAuthService } from '../../application/services/google-auth.service';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, BreadcrumbComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class RegistroComponent implements AfterViewInit {
  private auth = inject(AuthService);
  private googleAuth = inject(GoogleAuthService);
  private router = inject(Router);

  @ViewChild('googleBtn') googleBtn!: ElementRef<HTMLDivElement>;

  nombre = '';
  apellido = '';
  email = '';
  password = '';
  passwordConfirmation = '';

  cargando = signal(false);
  error = signal<string | null>(null);

  ngAfterViewInit(): void {
    this.googleAuth.renderButton(this.googleBtn.nativeElement, { text: 'signup_with' });
    this.googleAuth.onCredential.subscribe(idToken => this.registrarConGoogle(idToken));
  }

  registrar(): void {
    if (this.password !== this.passwordConfirmation) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.auth.register({
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      email: this.email.trim(),
      password: this.password,
      password_confirmation: this.passwordConfirmation,
    }).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(this.extraerError(err));
      },
    });
  }

  private registrarConGoogle(idToken: string): void {
    this.cargando.set(true);
    this.error.set(null);

    this.auth.loginWithGoogle(idToken).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(err.error?.error ?? 'No se pudo continuar con Google.');
      },
    });
  }

  private extraerError(err: HttpErrorResponse): string {
    const errors = err.error?.errors;
    if (errors) {
      const primero = Object.values(errors)[0];
      if (Array.isArray(primero) && primero.length) return String(primero[0]);
    }
    return err.error?.error ?? 'No se pudo completar el registro.';
  }
}
