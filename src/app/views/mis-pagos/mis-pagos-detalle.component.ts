import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoPortalService } from '../../pagos/application/services/pago-portal.service';
import { InscripcionResumen, CuotaEstado } from '../../pagos/domain/models/pago-portal.model';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-mis-pagos-detalle',
  standalone: true,
  imports: [DecimalPipe, FormsModule, RouterLink, BreadcrumbComponent],
  templateUrl: './mis-pagos-detalle.component.html',
})
export class MisPagosDetalleComponent implements OnInit {
  private route   = inject(ActivatedRoute);
  private service = inject(PagoPortalService);
  private cdr     = inject(ChangeDetectorRef);

  readonly idIns = Number(this.route.snapshot.paramMap.get('id_ins'));

  ci       = signal('');
  email    = signal('');
  expedido = signal('');

  cargando      = signal(false);
  error         = signal<string | null>(null);
  inscripcion   = signal<InscripcionResumen | null>(null);
  pagoEnCurso   = signal<number | null>(null);

  ngOnInit(): void {
    const qCi    = this.route.snapshot.queryParamMap.get('ci')       ?? '';
    const qEmail = this.route.snapshot.queryParamMap.get('email')     ?? '';
    const qExp   = this.route.snapshot.queryParamMap.get('expedido')  ?? '';
    this.ci.set(qCi);
    this.email.set(qEmail);
    this.expedido.set(qExp);
    if (qCi && qEmail) this.cargar();
  }

  cargar(): void {
    const ci    = this.ci().trim();
    const email = this.email().trim();
    if (!ci || !email) return;
    this.cargando.set(true);
    this.error.set(null);

    const expedido = this.expedido().trim() || undefined;
    this.service.getMisPagos(ci, email, expedido).subscribe({
      next: res => {
        const ins = res.data.find(i => i.id_ins === this.idIns) ?? null;
        if (!ins) {
          this.error.set('No se encontró esta inscripción para tu CI. Verifica tus datos.');
        }
        this.inscripcion.set(ins);
        this.cargando.set(false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.error.set('No se pudo cargar la inscripción. Intenta de nuevo.');
        this.cargando.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  pagarCuota(cuota: CuotaEstado): void {
    const ins = this.inscripcion();
    if (!ins || !ins.nombre_programa) return;

    this.pagoEnCurso.set(cuota.id_fechapago);

    this.service.iniciarPago({
      id_programa:  0,
      nombre:       '',
      appaterno:    '',
      ci:           this.ci().trim(),
      email:        '',
      monto:        cuota.monto_a_pagar,
      id_fechapago: cuota.id_fechapago,
      success_url:  `${window.location.origin}/checkout/{session_id}`,
      cancel_url:   `${window.location.origin}/pago-fallido`,
    }).subscribe({
      next: res => {
        window.location.href = res.checkout_url;
      },
      error: () => {
        this.pagoEnCurso.set(null);
        this.error.set('No se pudo iniciar el pago. Intenta de nuevo o contacta a secretaría.');
        this.cdr.detectChanges();
      },
    });
  }

  badgeClass(estado: InscripcionResumen['estado_pago']): string {
    return ({
      pagado:    'mp-badge mp-badge--pagado',
      parcial:   'mp-badge mp-badge--parcial',
      pendiente: 'mp-badge mp-badge--pendiente',
    })[estado] ?? 'mp-badge';
  }

  badgeLabel(estado: InscripcionResumen['estado_pago']): string {
    return ({ pagado: 'Pagado', parcial: 'Parcial', pendiente: 'Pendiente' })[estado] ?? estado;
  }

  porcentaje(ins: InscripcionResumen): number {
    if (ins.total_plan === 0) return 0;
    return Math.min(100, Math.round((ins.total_pagado / ins.total_plan) * 100));
  }
}
