import {
  Component, Input, Output, EventEmitter, OnChanges, SimpleChanges,
  inject, ChangeDetectorRef, signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertConfigPortal, CertConfigItem } from '../../domain/models/cert-config.model';
import { CertConfigService } from '../../application/services/cert-config.service';

type Paso = 'seleccion' | 'comprobante' | 'listo';

@Component({
  selector: 'app-cert-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cert-modal.component.html',
  styleUrls: ['./cert-modal.component.scss'],
})
export class CertModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() config: CertConfigPortal | null = null;
  @Input() programaId: number | null = null;
  @Input() usuarioCi   = '';
  @Input() usuarioNombre = '';
  @Input() usuarioEmail: string | null = null;
  @Input() inscripcionId: number | null = null;
  @Output() readonly closed = new EventEmitter<void>();

  private svc = inject(CertConfigService);
  private cdr = inject(ChangeDetectorRef);

  paso          = signal<Paso>('seleccion');
  selectedPago  = signal<number[]>([]);
  submitting    = signal(false);
  errorMsg      = signal<string | null>(null);

  uploadingFile    = signal(false);
  comprobanteUrl   = signal<string | null>(null);

  certificadoDescargaUrl = signal<string | null>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.paso.set('seleccion');
      this.selectedPago.set([]);
      this.errorMsg.set(null);
      this.comprobanteUrl.set(null);
      this.certificadoDescargaUrl.set(null);
      this.cdr.detectChanges();
    }
  }

  get items(): CertConfigItem[] {
    return this.config?.config?.items ?? [];
  }

  get itemGratuito(): CertConfigItem | undefined {
    return this.items.find(i => i.es_gratuito && i.activo);
  }

  get itemsPago(): CertConfigItem[] {
    return this.items.filter(i => !i.es_gratuito && i.activo);
  }

  isSelectedPago(id: number): boolean {
    return this.selectedPago().includes(id);
  }

  togglePago(id: number): void {
    this.selectedPago.update(list =>
      list.includes(id) ? list.filter(i => i !== id) : [...list, id]
    );
  }

  get hayPagoSeleccionado(): boolean {
    return this.selectedPago().length > 0;
  }

  confirmarSeleccion(): void {
    if (this.hayPagoSeleccionado) {
      this.paso.set('comprobante');
      this.cdr.detectChanges();
      return;
    }
    this.enviar(false);
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadingFile.set(true);
    this.svc.uploadFile(file).subscribe({
      next: (res) => {
        this.comprobanteUrl.set(res.url);
        this.uploadingFile.set(false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMsg.set('No se pudo subir el comprobante. Intente de nuevo.');
        this.uploadingFile.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  pagarAhora(): void {
    if (!this.comprobanteUrl()) {
      this.errorMsg.set('Por favor sube el comprobante de pago.');
      return;
    }
    this.enviar(true);
  }

  pagarDespues(): void {
    this.enviar(false);
  }

  private enviar(pagarAhora: boolean): void {
    if (!this.programaId) return;
    this.submitting.set(true);
    this.errorMsg.set(null);

    this.svc.crearSolicitudes({
      programa_id:     this.programaId,
      usuario_ci:      this.usuarioCi,
      usuario_nombre:  this.usuarioNombre,
      usuario_email:   this.usuarioEmail,
      inscripcion_id:  this.inscripcionId,
      items_pago_ids:  this.selectedPago(),
      pagar_ahora:     pagarAhora,
      comprobante_url: pagarAhora ? this.comprobanteUrl() : null,
    }).subscribe({
      next: (res) => {
        const gratuito = res.solicitudes.find(s => s.es_gratuito);
        this.certificadoDescargaUrl.set(gratuito?.certificado_url ?? null);
        this.paso.set('listo');
        this.submitting.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message ?? 'No se pudo procesar. Inténtelo de nuevo.');
        this.submitting.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  cerrar(): void {
    this.closed.emit();
  }
}
