import { Injectable, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { VisitaPayload } from '../../domain/models/analytics.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService implements OnDestroy {
  private router = inject(Router);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly endpoint   = '/api/v1/public/visitas';
  private readonly geoUrl     = 'https://ipapi.co/json/';
  private readonly storageKey = 'cenefco_session_id';
  private readonly geoStorageKey = 'cenefco_geo';

  private sessionId   = this.getOrCreateSessionId();
  private pageStart   = Date.now();
  private currentUrl  = '';
  private currentRuta = '';
  private geo: { pais?: string; ciudad?: string } = {};

  private routerSub!: Subscription;
  private visibilityFn!: () => void;
  private beforeUnloadFn!: () => void;

  init(): void {
    if (!this.isBrowser) return;
    this.fetchGeo();
    this.listenRouter();
    this.registerUnloadListeners();
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    if (!this.isBrowser) return;
    document.removeEventListener('visibilitychange', this.visibilityFn);
    window.removeEventListener('beforeunload', this.beforeUnloadFn);
  }

  private getOrCreateSessionId(): string {
    if (!this.isBrowser) return '';
    let id = sessionStorage.getItem(this.storageKey);
    if (!id) {
      id = typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(this.storageKey, id);
    }
    return id;
  }

  private fetchGeo(): void {
    const cached = sessionStorage.getItem(this.geoStorageKey);
    if (cached) {
      this.geo = JSON.parse(cached);
      return;
    }

    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    fetch(this.geoUrl, { signal: ctrl.signal })
      .then(r => r.json())
      .then(d => {
        if (d.country_name) {
          this.geo = { pais: d.country_name, ciudad: d.city };
          sessionStorage.setItem(this.geoStorageKey, JSON.stringify(this.geo));
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
  }

  private listenRouter(): void {
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.currentUrl   = window.location.href;
        this.currentRuta  = e.urlAfterRedirects;
        this.pageStart    = Date.now();
        this.send(undefined);
      });
  }

  private send(duracion_seg: number | undefined): void {
    if (!this.currentUrl) return;

    const payload: VisitaPayload = {
      session_id: this.sessionId,
      url:        this.currentUrl,
      ruta:       this.currentRuta,
      titulo:     document.title || undefined,
      referrer:   document.referrer || undefined,
      pais:       this.geo.pais,
      ciudad:     this.geo.ciudad,
      duracion_seg,
    };

    const body = JSON.stringify(payload);

    fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Portal-Key': environment.portalApiKey,
      },
      body,
      keepalive: true,
    }).catch(() => {});
  }

  private registerUnloadListeners(): void {
    this.visibilityFn = () => {
      if (document.visibilityState === 'hidden') {
        this.send(Math.round((Date.now() - this.pageStart) / 1000));
      }
    };
    this.beforeUnloadFn = () => {
      this.send(Math.round((Date.now() - this.pageStart) / 1000));
    };
    document.addEventListener('visibilitychange', this.visibilityFn);
    window.addEventListener('beforeunload', this.beforeUnloadFn);
  }
}
