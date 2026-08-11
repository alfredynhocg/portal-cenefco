import { Component, inject, signal, OnInit, OnDestroy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionService } from '../../../../configuracion/application/services/configuracion.service';
import { ConfiguracionSitio } from '../../../../configuracion/domain/models/configuracion.model';
import { MensajeContactoService } from '../../../../mensajes-contacto/application/services/mensaje-contacto.service';
import { CaptchaService, CaptchaResponse } from '../../../../captcha/captcha.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`

    .cc-section {
        position: relative;
        overflow: hidden;
        background-image: url('/assets/img/all-images/contact-bg-cenefco.jpg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }
    .cc-section::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(18,138,162,0.62);
        pointer-events: none;
        z-index: 0;
    }

    .cc-badge {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: rgba(255,255,255,0.15);
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.4px;
        padding: 6px 16px;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.25);
        margin-bottom: 16px;
    }
    .cc-badge i { color: #FC8900; }

    .cc-title {
        font-size: clamp(26px, 3.5vw, 38px);
        font-weight: 800;
        color: #fff;
        line-height: 1.2;
        margin-bottom: 14px;
    }
    .cc-subtitle {
        font-size: 15px;
        color: rgba(255,255,255,0.75);
        line-height: 1.7;
        margin-bottom: 32px;
    }

    .cc-info-grid {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }
    .cc-info-card {
        display: flex;
        align-items: center;
        gap: 18px;
        background: rgba(255,255,255,0.10);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 14px;
        padding: 16px 20px;
        border: 1px solid rgba(255,255,255,0.18);
        transition: transform .25s ease, background .25s ease, border-color .25s ease;
    }
    .cc-info-card:hover {
        transform: translateY(-3px);
        background: rgba(255,255,255,0.17);
        border-color: rgba(252,137,0,0.50);
    }
    .cc-info-icon {
        flex-shrink: 0;
        width: 50px;
        height: 50px;
        border-radius: 14px;
        background: #FC8900;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 19px;
        box-shadow: 0 4px 14px rgba(252,137,0,0.40);
        transition: transform .2s ease, box-shadow .2s ease;
    }
    .cc-info-card:hover .cc-info-icon {
        transform: scale(1.08);
        box-shadow: 0 6px 20px rgba(252,137,0,0.55);
    }
    .cc-info-text { flex: 1; min-width: 0; }
    .cc-info-label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: rgba(255,255,255,0.60);
        margin-bottom: 3px;
    }
    .cc-info-value {
        font-size: 14.5px;
        font-weight: 600;
        color: #fff;
        text-decoration: none;
        transition: color .2s;
        word-break: break-word;
        line-height: 1.4;
        display: block;
    }
    a.cc-info-value:hover { color: #FC8900; }

    .cc-form-card {
        background: #fff;
        border-radius: 18px;
        padding: 36px 36px;
        box-shadow: 0 8px 40px rgba(18,138,162,0.10);
        border: 1px solid rgba(18,138,162,0.06);
    }
    .cc-form-title {
        font-size: 20px;
        font-weight: 800;
        color: #128AA2;
        margin-bottom: 6px;
    }
    .cc-form-subtitle {
        font-size: 13px;
        color: #999;
        margin-bottom: 24px;
        line-height: 1.5;
    }

    .cc-field {
        margin-bottom: 16px;
    }
    .cc-field label {
        display: block;
        font-size: 12px;
        font-weight: 700;
        color: #555;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 6px;
    }
    .cc-field input,
    .cc-field textarea,
    .cc-field select {
        width: 100%;
        padding: 12px 16px;
        border: 1.5px solid rgba(18,138,162,0.15);
        border-radius: 10px;
        font-size: 14px;
        color: #333;
        background: #fafbfc;
        outline: none;
        transition: border-color .2s, box-shadow .2s;
        font-family: inherit;
        resize: none;
        box-sizing: border-box;
    }
    .cc-field input:focus,
    .cc-field textarea:focus {
        border-color: #128AA2;
        background: #fff;
        box-shadow: 0 0 0 3px rgba(18,138,162,0.08);
    }
    .cc-field textarea { height: 110px; }

    .cc-check {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 20px;
    }
    .cc-check input[type="checkbox"] {
        width: 16px;
        height: 16px;
        margin-top: 2px;
        accent-color: #128AA2;
        flex-shrink: 0;
        cursor: pointer;
    }
    .cc-check span {
        font-size: 13px;
        color: #666;
        line-height: 1.5;
    }

    .cc-submit-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #128AA2;
        color: #fff;
        font-size: 15px;
        font-weight: 700;
        padding: 14px 32px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        transition: all .3s ease;
        width: 100%;
        justify-content: center;
    }
    .cc-submit-btn:hover:not(:disabled) {
        background: #FC8900;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(252,137,0,0.30);
    }
    .cc-submit-btn:disabled {
        opacity: 0.65;
        cursor: not-allowed;
    }
    .cc-submit-btn i { font-size: 13px; }

    .cc-alert {
        border-radius: 10px;
        padding: 12px 16px;
        font-size: 13.5px;
        font-weight: 600;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .cc-alert-success {
        background: rgba(16,185,129,0.1);
        color: #065f46;
        border: 1px solid rgba(16,185,129,0.25);
    }
    .cc-alert-error {
        background: rgba(239,68,68,0.08);
        color: #991b1b;
        border: 1px solid rgba(239,68,68,0.20);
    }

    @media (max-width: 991px) {
        .cc-form-card { padding: 28px 22px; }
        .cc-info-grid { flex-direction: row; flex-wrap: wrap; }
        .cc-info-card { flex: 1 1 calc(50% - 8px); min-width: 200px; }
    }
    @media (max-width: 575px) {
        .cc-info-card { flex: 1 1 100%; }
        .cc-form-card { padding: 22px 16px; }
    }

    .captcha-img { height: 50px; border-radius: 6px; border: 1.5px solid rgba(18,138,162,0.15); }
    .captcha-placeholder { height: 50px; width: 200px; border-radius: 6px; border: 1.5px solid rgba(18,138,162,0.15); background: #fafbfc; }
    .captcha-refresh-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #128AA2; padding: 4px 8px; transition: color 0.2s; }
    .captcha-refresh-btn:hover:not(:disabled) { color: #FC8900; }
    .captcha-refresh-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  `]
})
export class ContactComponent implements OnInit, OnDestroy {
  private configuracionService  = inject(ConfiguracionService);
  private mensajeService        = inject(MensajeContactoService);
  private captchaService        = inject(CaptchaService);
  private cdr                   = inject(ChangeDetectorRef);
  private resetTimer?: ReturnType<typeof setTimeout>;

  config = signal<ConfiguracionSitio>({});

  form = {
    nombre:        '',
    telefono:      '',
    email:         '',
    asunto:        '',
    mensaje:       '',
    acepto:        false,
    captcha_value: '',
  };

  captcha: CaptchaResponse | null = null;
  captchaLoading = false;

  sending  = false;
  success  = false;
  errorMsg = '';

  ngOnInit(): void {
    this.configuracionService.getPublica().subscribe({
      next: res => { this.config.set(res.data); this.cdr.detectChanges(); },
      error: () => {}
    });
    this.loadCaptcha();
  }

  ngOnDestroy(): void {
    clearTimeout(this.resetTimer);
  }

  loadCaptcha(): void {
    this.captchaLoading = true;
    this.form.captcha_value = '';
    this.captchaService.generate().subscribe({
      next: res => { this.captcha = res; this.captchaLoading = false; this.cdr.detectChanges(); },
      error: () => { this.captchaLoading = false; this.cdr.detectChanges(); },
    });
  }

  get telHref(): string | null {
    return this.config().telefono
      ? 'tel:' + this.config().telefono!.replace(/\D/g, '')
      : null;
  }

  get emailHref(): string | null {
    return this.config().email_contacto
      ? 'mailto:' + this.config().email_contacto
      : null;
  }

  get direccionTexto(): string {
    return this.config().direccion || '—';
  }

  enviar(): void {
    if (!this.form.nombre || !this.form.email || !this.form.asunto || !this.form.mensaje || !this.form.acepto || !this.form.captcha_value || !this.captcha) return;

    this.sending  = true;
    this.success  = false;
    this.errorMsg = '';

    this.mensajeService.enviar({
      nombre_remitente:  this.form.nombre,
      email_remitente:   this.form.email,
      telefono_remitente: this.form.telefono || null,
      asunto:            this.form.asunto,
      mensaje:           this.form.mensaje,
      captcha_key:       this.captcha.key,
      captcha_value:     this.form.captcha_value,
    }).subscribe({
      next: () => {
        this.success = true;
        this.form = { nombre: '', telefono: '', email: '', asunto: '', mensaje: '', acepto: false, captcha_value: '' };
        this.sending = false;
        this.loadCaptcha();
        this.resetTimer = setTimeout(() => { this.success = false; this.cdr.detectChanges(); }, 60000);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMsg = 'Ocurrió un error al enviar el mensaje. Por favor, intentá nuevamente.';
        this.sending = false;
        this.loadCaptcha();
        this.cdr.detectChanges();
      }
    });
  }
}
