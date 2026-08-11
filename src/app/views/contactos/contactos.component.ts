import { Component, computed, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { MensajeContactoService } from '../../mensajes-contacto/application/services/mensaje-contacto.service';
import { CaptchaService, CaptchaResponse } from '../../captcha/captcha.service';
import { CONTACT } from '@core/constants/contact.constants';
import { ConfiguracionService } from '../../configuracion/application/services/configuracion.service';
import { ConfiguracionSitio } from '../../configuracion/domain/models/configuracion.model';

@Component({
  selector: 'app-contactos',
  imports: [BreadcrumbComponent, ReactiveFormsModule],
  templateUrl: './contactos.component.html',
  styles: [`
    :host ::ng-deep .hero1-section-area.about-bg-area {
        padding-top: 150px !important;
        padding-bottom: 80px !important;
        min-height: unset !important;
        height: auto !important;
        position: relative !important;
    }
    :host ::ng-deep .hero1-section-area.about-bg-area::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(18,138,162,0.88) 0%, rgba(4,40,55,0.72) 50%, rgba(252,137,0,0.22) 100%);
        z-index: 1;
        pointer-events: none;
    }
    :host ::ng-deep .hero1-section-area.about-bg-area .container {
        position: relative;
        z-index: 2;
    }
    .captcha-img {
        height: 50px;
        border-radius: 6px;
        border: 1px solid #ddd;
    }
    .captcha-placeholder {
        height: 50px;
        width: 200px;
        border-radius: 6px;
        border: 1px solid #ddd;
        background: #f8f9fa;
    }
    .captcha-refresh-btn {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #6c757d;
        padding: 4px 8px;
        transition: color 0.2s;
    }
    .captcha-refresh-btn:hover:not(:disabled) { color: #0d6efd; }
    .captcha-refresh-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* === Sección mapa === */
    .mapa-seccion { margin-top: 48px; }
    .mapa-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 16px;
    }
    .mapa-header h4 { margin: 0; }
    .mapa-wrapper {
        position: relative;
        border-radius: 12px;
        box-shadow: 0 4px 18px rgba(0,0,0,0.10);
    }
    .mapa-iframe-box {
        border-radius: 12px;
        overflow: hidden;
        line-height: 0;
    }
    .mapa-iframe-box iframe {
        width: 100%;
        height: 400px;
        border: 0;
        display: block;
    }
    @media (max-width: 767px) {
        .mapa-iframe-box iframe { height: 260px; }
        .mapa-header { flex-direction: column; align-items: flex-start; }
    }

    /* Marcador — left/top se inyectan dinámicamente desde pinPosition() */
    .mapa-pin {
        position: absolute;
        transform: translate(-50%, -100%);
        z-index: 10;
    }
    /* Área transparente clickeable encima del pin verde nativo de OSM */
    .mapa-pin-btn {
        display: block;
        width: 32px;
        height: 42px;
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
    }

    /* Burbuja */
    .mapa-burbuja {
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 6px 24px rgba(0,0,0,0.15);
        padding: 10px 16px;
        width: max-content;
        max-width: min(260px, 80vw);
        text-align: center;
        pointer-events: none;
        animation: burbujaIn 0.18s ease;
    }
    .mapa-burbuja p { margin: 0; font-size: 13px; font-weight: 600; color: #042837; line-height: 1.5; }
    .mapa-burbuja-flecha {
        position: absolute;
        bottom: -7px;
        left: 50%;
        transform: translateX(-50%);
        width: 14px;
        height: 7px;
        overflow: hidden;
    }
    .mapa-burbuja-flecha::after {
        content: '';
        display: block;
        width: 14px;
        height: 14px;
        background: #fff;
        box-shadow: 0 4px 18px rgba(0,0,0,0.12);
        transform: rotate(45deg);
        margin-top: -7px;
    }
    @keyframes burbujaIn {
        from { opacity: 0; transform: translateX(-50%) translateY(6px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `]
})
export class ContactUsComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private mensajeService = inject(MensajeContactoService);
  private captchaService = inject(CaptchaService);
  private configuracionService = inject(ConfiguracionService);
  private sanitizer = inject(DomSanitizer);

  readonly CONSTANTS = CONTACT;
  private resetTimer?: ReturnType<typeof setTimeout>;
  config = signal<ConfiguracionSitio>({});
  mostrarBurbuja = signal(false);

  readonly mapaEmbedUrl = computed<SafeResourceUrl | null>(() => {
    const coords = this.coordenadas();
    if (!coords) return null;
    const d = 0.018;
    const bbox = [
      (coords.lng - d).toFixed(6),
      (coords.lat - d).toFixed(6),
      (coords.lng + d).toFixed(6),
      (coords.lat + d).toFixed(6),
    ].join(',');
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat},${coords.lng}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  readonly pinPosition = computed<{ left: string; top: string } | null>(() => {
    return this.coordenadas() ? { left: '50%', top: '50%' } : null;
  });

  readonly tieneUbicacion = computed(() => this.coordenadas() !== null);

  readonly googleMapsUrl = computed<string>(() => {
    const coords = this.coordenadas();
    if (coords) return `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    return this.direccionTexto
      ? `https://www.google.com/maps/search/${encodeURIComponent(this.direccionTexto)}`
      : 'https://www.google.com/maps';
  });

  form: FormGroup = this.fb.group({
    nombre_remitente: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/)]],
    telefono_remitente: ['', [Validators.pattern(/^[67]\d{7}$/)]],
    email_remitente: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    mensaje: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    privacidad: [false, [Validators.requiredTrue]],
    captcha_value: ['', [Validators.required]],
  });

  captcha: CaptchaResponse | null = null;
  captchaLoading = false;

  enviado = false;
  enviando = false;
  error = false;

  ngOnInit(): void {
    this.loadCaptcha();
    this.loadConfiguracion();
  }

  loadConfiguracion(): void {
    this.configuracionService.getPublica().subscribe({
      next: (res) => this.config.set(res.data ?? {}),
      error: () => {},
    });
  }

  get telefonoTexto(): string {
    return this.config().telefono?.trim() ?? '';
  }

  get telefonoHref(): string | null {
    return this.telefonoTexto ? `tel:${this.telefonoTexto.replace(/[^\d+]/g, '')}` : null;
  }

  get emailTexto(): string {
    return this.config().email_contacto?.trim() ?? '';
  }

  get emailHref(): string | null {
    return this.emailTexto ? `mailto:${this.emailTexto}` : null;
  }

  get direccionTexto(): string {
    const config = this.config();
    const direccion = config.direccion?.trim();
    if (direccion) return direccion;

    return [config.ciudad, config.pais]
      .map((value) => value?.trim())
      .filter(Boolean)
      .join(', ');
  }

  get horarioTexto(): string {
    return this.config().horario_atencion?.trim() ?? '';
  }

  private readonly coordenadas = computed<{ lat: number; lng: number } | null>(() => {
    const { latitud, longitud } = this.config();
    const lat = Number(latitud);
    const lng = Number(longitud);
    return latitud != null && longitud != null && !isNaN(lat) && !isNaN(lng)
      ? { lat, lng }
      : null;
  });


  loadCaptcha(): void {
    this.captchaLoading = true;
    this.form.get('captcha_value')?.reset('');
    this.captchaService.generate().subscribe({
      next: (res) => {
        this.captcha = res;
        this.captchaLoading = false;
      },
      error: () => { this.captchaLoading = false; },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.error = false;

    const { privacidad, captcha_value, ...campos } = this.form.value;

    this.mensajeService.enviar({
      ...campos,
      asunto: 'Contacto desde el portal',
      captcha_key: this.captcha!.key,
      captcha_value,
    }).subscribe({
      next: () => {
        this.enviado = true;
        this.enviando = false;
        this.form.reset();
        this.resetTimer = setTimeout(() => { this.enviado = false; this.loadCaptcha(); }, 60000);
      },
      error: (_err: unknown) => {
        this.error = true;
        this.enviando = false;
        this.loadCaptcha();
      },
    });
  }

  toggleBurbuja(event: Event): void {
    event.stopPropagation();
    this.mostrarBurbuja.update(v => !v);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.mostrarBurbuja()) this.mostrarBurbuja.set(false);
  }

  ngOnDestroy(): void {
    clearTimeout(this.resetTimer);
  }

  get f() { return this.form.controls; }
}
