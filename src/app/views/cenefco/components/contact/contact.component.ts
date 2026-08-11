import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MensajeContactoService } from '../../../../mensajes-contacto/application/services/mensaje-contacto.service';
import { CaptchaService, CaptchaResponse } from '../../../../captcha/captcha.service';
import { CONTACT } from '../../../../core/constants/contact.constants';
import { ConfiguracionService } from '../../../../configuracion/application/services/configuracion.service';
import { ConfiguracionSitio } from '../../../../configuracion/domain/models/configuracion.model';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styles: [`
    .captcha-img { height: 50px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.3); }
    .captcha-placeholder { height: 50px; width: 200px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); }
    .captcha-refresh-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: rgba(255,255,255,0.7); padding: 4px 8px; transition: color 0.2s; }
    .captcha-refresh-btn:hover:not(:disabled) { color: #fff; }
    .captcha-refresh-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  `]
})
export class ContactComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private mensajeService = inject(MensajeContactoService);
  private captchaService = inject(CaptchaService);
  private configuracionService = inject(ConfiguracionService);
  private resetTimer?: ReturnType<typeof setTimeout>;

  form: FormGroup = this.fb.group({
    nombre_remitente:   ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/)]],
    telefono_remitente: ['', [Validators.pattern(/^[67]\d{7}$/)]],
    email_remitente:    ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    mensaje:            ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    privacidad:         [false, [Validators.requiredTrue]],
    captcha_value:      ['', [Validators.required]],
  });

  readonly ui = CONTACT;
  config = signal<ConfiguracionSitio>({});
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

  loadCaptcha(): void {
    this.captchaLoading = true;
    this.form.get('captcha_value')?.reset('');
    this.captchaService.generate().subscribe({
      next: (res) => { this.captcha = res; this.captchaLoading = false; },
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

  ngOnDestroy(): void {
    clearTimeout(this.resetTimer);
  }

  get f() { return this.form.controls; }
}
