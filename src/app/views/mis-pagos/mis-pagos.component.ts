import { Component, inject, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PagoPortalService } from '../../pagos/application/services/pago-portal.service';
import {
  InscripcionResumen,
  EstudianteResumen,
  CuotaEstado,
} from '../../pagos/domain/models/pago-portal.model';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { AuthService } from '../../auth/application/services/auth.service';
import { AuthUser } from '../../auth/domain/models/auth.model';
import { PerfilFormComponent } from './perfil-form.component';

@Component({
  selector: 'app-mis-pagos',
  standalone: true,
  imports: [FormsModule, DecimalPipe, DatePipe, RouterLink, BreadcrumbComponent, PerfilFormComponent],
  templateUrl: './mis-pagos.component.html',
})
export class MisPagosComponent implements OnInit {
  private service = inject(PagoPortalService);
  private auth    = inject(AuthService);
  private cdr     = inject(ChangeDetectorRef);
  private router  = inject(Router);

  ci       = '';
  email    = '';
  expedido = '';

  cargando      = signal(false);
  buscado       = signal(false);
  error         = signal<string | null>(null);
  estudiante    = signal<EstudianteResumen | null>(null);
  inscripciones = signal<InscripcionResumen[]>([]);
  abiertos      = signal<Set<number>>(new Set());

  isLoggedIn    = this.auth.isLoggedIn();
  cuenta        = signal<AuthUser | null>(this.auth.currentUser());
  editandoPerfil = signal(false);

  ngOnInit(): void {
    if (!this.isLoggedIn) return;

    if (this.cuenta()?.email) this.email = this.cuenta()!.email;

    this.auth.getMe().subscribe({
      next: user => {
        this.cuenta.set(user);
        if (user.email) this.email = user.email;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  buscar(): void {
    const ci    = this.ci.trim();
    const email = this.email.trim();
    if (!ci || !email) return;
    this.cargando.set(true);
    this.error.set(null);
    this.buscado.set(false);
    this.service.getMisPagos(ci, email, this.expedido.trim() || undefined).subscribe({
      next: res => {
        this.estudiante.set(res.estudiante);
        this.inscripciones.set(res.data);
        this.abiertos.set(new Set());
        this.cargando.set(false);
        this.buscado.set(true);
        this.cdr.detectChanges();
      },
      error: () => {
        this.error.set('No se pudo consultar. Verifica tu CI e intenta de nuevo.');
        this.cargando.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  toggleAcordeon(idIns: number): void {
    const set = new Set(this.abiertos());
    if (set.has(idIns)) { set.delete(idIns); } else { set.add(idIns); }
    this.abiertos.set(set);
    this.cdr.detectChanges();
  }

  estaAbierto(idIns: number): boolean { return this.abiertos().has(idIns); }

  contarEstado(estado: 'pagado' | 'parcial' | 'pendiente'): number {
    return this.inscripciones().filter(i => i.estado_pago === estado).length;
  }

  badgeClass(estado: 'pagado' | 'parcial' | 'pendiente'): string {
    return ({ pagado: 'mp-badge mp-badge--pagado', parcial: 'mp-badge mp-badge--parcial', pendiente: 'mp-badge mp-badge--pendiente' })[estado] ?? 'mp-badge';
  }

  badgeLabel(estado: 'pagado' | 'parcial' | 'pendiente'): string {
    return ({ pagado: 'Pagado', parcial: 'Parcial', pendiente: 'Pendiente' })[estado] ?? estado;
  }

  metodoPagoLabel(m: CuotaEstado['metodo_pago']): string {
    return ({ efectivo: 'Efectivo', deposito_bancario: 'Depósito', pago_online: 'Online', qr: 'QR' } as Record<string, string>)[m ?? ''] ?? '—';
  }

  porcentaje(ins: InscripcionResumen): number {
    if (ins.total_plan === 0) return 0;
    return Math.min(100, Math.round((ins.total_pagado / ins.total_plan) * 100));
  }

  onPerfilActualizado(user: AuthUser): void {
    this.cuenta.set(user);
    this.editandoPerfil.set(false);
    this.cdr.detectChanges();
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  limpiar(): void {
    this.ci = ''; this.email = ''; this.expedido = '';
    this.buscado.set(false); this.estudiante.set(null);
    this.inscripciones.set([]); this.error.set(null);
    this.cdr.detectChanges();
  }
}
