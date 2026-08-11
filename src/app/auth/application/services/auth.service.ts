import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, AuthUser, LoginPayload, RegisterPayload, UpdatePerfilPayload } from '../../domain/models/auth.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenStorage = inject(TokenStorageService);

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register-publico', payload).pipe(
      tap(response => this.tokenStorage.setSession(response))
    );
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', payload).pipe(
      tap(response => this.tokenStorage.setSession(response))
    );
  }

  loginWithGoogle(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/google', { id_token: idToken }).pipe(
      tap(response => this.tokenStorage.setSession(response))
    );
  }

  logout(): void {
    this.tokenStorage.clearSession();
  }

  isLoggedIn(): boolean {
    return this.tokenStorage.isLoggedIn();
  }

  currentUser(): AuthUser | null {
    return this.tokenStorage.getUser();
  }

  getMe(): Observable<AuthUser> {
    return this.http.get<AuthUser>('/api/auth/me');
  }

  updatePerfil(payload: UpdatePerfilPayload): Observable<AuthUser> {
    return this.http.put<AuthUser>('/api/auth/perfil', payload).pipe(
      tap(user => this.tokenStorage.updateUser(user))
    );
  }
}
