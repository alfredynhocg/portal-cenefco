import { Component, inject, OnInit, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { PopupPortalService } from '../application/services/popup.service';
import { Popup } from '../domain/models/popup.model';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';

const SESSION_KEY = 'cenefco_popup_session';
const STORAGE_KEY = 'cenefco_popup_seen';

@Component({
  selector: 'app-popup-display',
  standalone: true,
  imports: [CommonModule, ImageUrlPipe],
  templateUrl: './popup-display.component.html',
  styleUrl: './popup-display.component.scss',
})
export class PopupDisplayComponent implements OnInit, OnDestroy {
  private service = inject(PopupPortalService);
  private router = inject(Router);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  popup   = signal<Popup | null>(null);
  visible = signal(false);

  private todosLosPopups: Popup[] = [];
  private queue:  Popup[] = [];
  private timers: ReturnType<typeof setTimeout>[] = [];
  private navegacionSub: Subscription | null = null;

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.service.getActivos().subscribe({
      next: (popups) => {
        this.todosLosPopups = popups;
        this.schedulePopups();
      },
      error: () => {},
    });

    this.navegacionSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.schedulePopups());
  }

  ngOnDestroy(): void {
    this.timers.forEach(t => clearTimeout(t));
    this.navegacionSub?.unsubscribe();
  }

  private aplicaARutaActual(p: Popup): boolean {
    const restriccion = p.paginas_mostrar?.trim();
    if (!restriccion) return true;

    const rutaActual = this.router.url.split('?')[0].split('#')[0];
    const rutasPermitidas = restriccion.split(',').map(r => r.trim()).filter(Boolean);
    return rutasPermitidas.includes(rutaActual);
  }

  private schedulePopups(): void {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
    this.queue = [];
    this.visible.set(false);
    this.popup.set(null);

    const now         = new Date();
    const seenAlways  = this.getSeenAlways();
    const seenSession = this.getSeenSession();

    const candidates = this.todosLosPopups.filter(p => {
      if (!p.activo) return false;
      if (!this.aplicaARutaActual(p)) return false;
      if (p.fecha_inicio && new Date(p.fecha_inicio) > now) return false;
      if (p.fecha_fin    && new Date(p.fecha_fin)    < now) return false;
      if (p.mostrar_una_vez_siempre && seenAlways.includes(p.id))  return false;
      if (p.mostrar_una_vez_sesion  && seenSession.includes(p.id)) return false;
      return true;
    });

    this.queue = [...candidates].sort((a, b) => a.delay_segundos - b.delay_segundos);
    this.scheduleNext();
  }

  private scheduleNext(): void {
    if (this.queue.length === 0) return;

    const p     = this.queue.shift()!;
    const delay = Math.max(0, (p.delay_segundos ?? 0)) * 1000;

    const t = setTimeout(() => {
      if (!this.aplicaARutaActual(p)) return;
      this.popup.set(p);
      this.visible.set(true);
    }, delay);

    this.timers.push(t);
  }

  close(): void {
    const p = this.popup();
    if (!p) return;

    if (p.mostrar_una_vez_siempre) this.markSeenAlways(p.id);
    if (p.mostrar_una_vez_sesion)  this.markSeenSession(p.id);

    this.visible.set(false);
    this.popup.set(null);

    const t = setTimeout(() => this.scheduleNext(), 500);
    this.timers.push(t);
  }

  positionClass(posicion: string | null): string {
    const map: Record<string, string> = {
      'center':       'popup-center',
      'top':          'popup-top',
      'bottom':       'popup-bottom',
      'top-left':     'popup-top-left',
      'top-right':    'popup-top-right',
      'bottom-left':  'popup-bottom-left',
      'bottom-right': 'popup-bottom-right',
    };
    return map[posicion ?? 'center'] ?? 'popup-center';
  }

  private getSeenAlways(): number[] {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
    catch { return []; }
  }

  private getSeenSession(): number[] {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '[]'); }
    catch { return []; }
  }

  private markSeenAlways(id: number): void {
    const seen = this.getSeenAlways();
    if (!seen.includes(id)) localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen, id]));
  }

  private markSeenSession(id: number): void {
    const seen = this.getSeenSession();
    if (!seen.includes(id)) sessionStorage.setItem(SESSION_KEY, JSON.stringify([...seen, id]));
  }
}
