import {
  Component, ChangeDetectorRef, inject, signal, computed,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { CarritoService } from '../../carrito/application/services/carrito.service';
import { ItemCarrito } from '../../carrito/domain/models/carrito.model';
import { PagoPortalService } from '../../pagos/application/services/pago-portal.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule, RouterLink, BreadcrumbComponent],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent {
  readonly carritoService = inject(CarritoService);
  private pagoService     = inject(PagoPortalService);
  private cdr             = inject(ChangeDetectorRef);

  nombre    = signal('');
  appaterno = signal('');
  ci        = signal('');
  expedido  = signal('LP');
  email     = signal('');
  telefono  = signal('');

  buscandoCi = signal(false);
  enviando   = signal(false);
  error      = signal('');
  paso       = signal<1 | 2>(1);

  readonly items = this.carritoService.items;
  readonly total = this.carritoService.total;
  readonly vacio = computed(() => this.items().length === 0);

  precioItem(item: ItemCarrito): number {
    if (item.plan_costo != null) return Number(item.plan_costo);
    const n = Number(item.inversion ?? 0);
    return isNaN(n) ? 0 : n;
  }

  onCiBlur(): void {
    const ciVal = this.ci().trim();
    if (ciVal.length < 3) return;
    this.buscandoCi.set(true);
    this.pagoService.buscarPorCi(ciVal).subscribe({
      next: res => {
        if (res) {
          if (res.nombre)    this.nombre.set(res.nombre);
          if (res.appaterno) this.appaterno.set(res.appaterno);
          if (res.email)     this.email.set(res.email);
          if (res.celular)   this.telefono.set(res.celular);
          if (res.expedido)  this.expedido.set(res.expedido);
        }
        this.buscandoCi.set(false);
        this.cdr.detectChanges();
      },
      error: () => { this.buscandoCi.set(false); },
    });
  }

  irPaso2(): void {
    this.error.set('');
    if (!this.ci().trim())        { this.error.set('Ingresa tu número de CI'); return; }
    if (!this.nombre().trim())    { this.error.set('Ingresa tu nombre'); return; }
    if (!this.appaterno().trim()) { this.error.set('Ingresa tu apellido paterno'); return; }
    if (!this.email().trim() || !this.email().includes('@')) {
      this.error.set('Ingresa un email válido'); return;
    }
    this.paso.set(2);
    this.cdr.detectChanges();
  }

  volver(): void {
    this.paso.set(1);
    this.cdr.detectChanges();
  }

  confirmarPago(): void {
    const items = this.items();
    if (items.length === 0) return;
    this.enviando.set(true);
    this.error.set('');
    const baseUrl = window.location.origin;

    const itemsPayload = items.map(i => ({
      id_programa: i.id_programa,
      monto: i.plan_costo != null ? Number(i.plan_costo) : Number(i.inversion ?? 0),
    }));

    this.pagoService.iniciarPagoMultiple({
      items:       itemsPayload,
      nombre:      this.nombre().trim(),
      appaterno:   this.appaterno().trim(),
      ci:          this.ci().trim(),
      expedido:    this.expedido() || 'LP',
      email:       this.email().trim(),
      telefono:    this.telefono().trim() || null,
      success_url: `${baseUrl}/pago-exitoso`,
      cancel_url:  `${baseUrl}/pago-fallido`,
    }).subscribe({
      next: responses => {
        this.carritoService.vaciar();
        window.location.href = responses[0].checkout_url;
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'No se pudo procesar el pago. Intenta nuevamente.');
        this.enviando.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  quitar(id: number): void {
    this.carritoService.quitar(id);
    this.cdr.detectChanges();
  }
}
