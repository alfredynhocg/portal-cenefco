import {
  Component, Input, Output, EventEmitter,
  OnInit, ChangeDetectorRef, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Curso, CuotaPortal } from '../../cursos/domain/models/curso.model';
import { PagoPortalService } from '../../pagos/application/services/pago-portal.service';

type Paso = 1 | 2 | 3;

@Component({
  selector: 'app-pago-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago-modal.component.html',
})
export class PagoModalComponent implements OnInit {
  @Input() curso!: Curso;
  @Input() visible = false;
  @Output() cerrar = new EventEmitter<void>();

  private pagoService = inject(PagoPortalService);
  private router      = inject(Router);
  private cdr         = inject(ChangeDetectorRef);

  paso: Paso = 1;

  nombre    = '';
  appaterno = '';
  ci        = '';
  expedido  = 'LP';
  email     = '';
  telefono  = '';
  buscandoCi = false;
  errorPaso1 = '';

  cuotaSeleccionada: CuotaPortal | null = null;
  pagoUnico = false;

  enviando = false;
  errorPago = '';

  get montoAPagar(): number {
    if (this.cuotaSeleccionada) return this.cuotaSeleccionada.monto_a_pagar;
    return this.curso?.plan_costo ?? 0;
  }

  get tieneCuotas(): boolean {
    return (this.curso?.cuotas?.length ?? 0) > 0;
  }

  ngOnInit(): void {
    if (this.tieneCuotas) {
      this.cuotaSeleccionada = this.curso.cuotas[0];
    }
  }

  onCiBlur(): void {
    const ci = this.ci.trim();
    if (ci.length < 3) return;
    this.buscandoCi = true;
    this.pagoService.buscarPorCi(ci).subscribe({
      next: res => {
        if (res) {
          if (res.nombre)    this.nombre    = res.nombre;
          if (res.appaterno) this.appaterno = res.appaterno;
          if (res.email)     this.email     = res.email;
          if (res.celular)   this.telefono  = res.celular;
          if (res.expedido)  this.expedido  = res.expedido;
        }
        this.buscandoCi = false;
        this.cdr.detectChanges();
      },
      error: () => { this.buscandoCi = false; },
    });
  }

  irPaso2(): void {
    this.errorPaso1 = '';
    if (!this.nombre.trim())    { this.errorPaso1 = 'Ingresa tu nombre'; return; }
    if (!this.appaterno.trim()) { this.errorPaso1 = 'Ingresa tu apellido paterno'; return; }
    if (!this.ci.trim())        { this.errorPaso1 = 'Ingresa tu CI'; return; }
    if (!this.email.trim() || !this.email.includes('@')) {
      this.errorPaso1 = 'Ingresa un email válido'; return;
    }
    this.paso = 2;
  }

  irPaso3(): void {
    this.paso = 3;
  }

  volver(): void {
    if (this.paso === 2) this.paso = 1;
    else if (this.paso === 3) this.paso = 2;
  }

  confirmarPago(): void {
    this.enviando  = true;
    this.errorPago = '';

    const baseUrl  = window.location.origin;
    this.pagoService.iniciarPago({
      id_programa:   this.curso.id_programa,
      nombre:        this.nombre.trim(),
      appaterno:     this.appaterno.trim(),
      ci:            this.ci.trim(),
      expedido:      this.expedido || 'LP',
      email:         this.email.trim(),
      telefono:      this.telefono.trim() || null,
      id_fechapago:  this.cuotaSeleccionada?.id_fechapago ?? null,
      monto:         this.montoAPagar,
      success_url:   `${baseUrl}/pago-exitoso`,
      cancel_url:    `${baseUrl}/pago-fallido`,
    }).subscribe({
      next: res => {
        window.location.href = res.checkout_url;
      },
      error: (err) => {
        this.errorPago = err?.error?.message ?? 'No se pudo procesar el pago. Intenta nuevamente.';
        this.enviando  = false;
        this.cdr.detectChanges();
      },
    });
  }

  resetYCerrar(): void {
    this.paso          = 1;
    this.nombre        = '';
    this.appaterno     = '';
    this.ci            = '';
    this.expedido      = 'LP';
    this.email         = '';
    this.telefono      = '';
    this.errorPaso1    = '';
    this.errorPago     = '';
    this.enviando      = false;
    this.cuotaSeleccionada = this.tieneCuotas ? this.curso.cuotas[0] : null;
    this.cerrar.emit();
  }
}
