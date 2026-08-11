import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private isBrowser = isPlatformBrowser(this.platformId);

  private scriptLoaded = false;
  private scriptLoadingPromise: Promise<void> | null = null;
  private initialized = false;

  private credential$ = new Subject<string>();
  readonly onCredential = this.credential$.asObservable();

  private loadScript(): Promise<void> {
    if (!this.isBrowser) return Promise.resolve();
    if (this.scriptLoaded) return Promise.resolve();
    if (this.scriptLoadingPromise) return this.scriptLoadingPromise;

    this.scriptLoadingPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => { this.scriptLoaded = true; resolve(); };
      script.onerror = () => reject(new Error('No se pudo cargar Google Identity Services.'));
      document.head.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    await this.loadScript();

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: { credential: string }) => {
        this.ngZone.run(() => this.credential$.next(response.credential));
      },
    });

    this.initialized = true;
  }

  async renderButton(container: HTMLElement, options: Record<string, unknown> = {}): Promise<void> {
    if (!this.isBrowser || !environment.googleClientId) return;

    await this.ensureInitialized();

    google.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
      width: 280,
      text: 'continue_with',
      ...options,
    });
  }
}
