import { Component, AfterViewInit, ElementRef, ViewChild, inject, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../application/services/auth.service';
import { GoogleAuthService } from '../../application/services/google-auth.service';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, BreadcrumbComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements AfterViewInit {
  private auth = inject(AuthService);
  private googleAuth = inject(GoogleAuthService);
  private router = inject(Router);

  @ViewChild('googleBtn') googleBtn!: ElementRef<HTMLDivElement>;

  email = '';
  password = '';

  cargando = signal(false);
  error = signal<string | null>(null);

  ngAfterViewInit(): void {
    this.googleAuth.renderButton(this.googleBtn.nativeElement);
    this.googleAuth.onCredential.subscribe(idToken => this.loginConGoogle(idToken));
  }

  ingresar(): void {
    const email = this.email.trim();
    const password = this.password;
    if (!email || !password) return;

    this.cargando.set(true);
    this.error.set(null);

    this.auth.login({ email, password }).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(err.error?.error ?? 'No se pudo iniciar sesión. Verifica tus credenciales.');
      },
    });
  }

  private loginConGoogle(idToken: string): void {
    this.cargando.set(true);
    this.error.set(null);

    this.auth.loginWithGoogle(idToken).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(err.error?.error ?? 'No se pudo iniciar sesión con Google.');
      },
    });
  }
}
