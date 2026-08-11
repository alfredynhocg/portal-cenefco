import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SeguimientoPanelService } from '../../application/services/seguimiento-panel.service';
import { CorrespondenciaService } from '../../application/services/correspondencia.service';
import { Correspondencia } from '../../domain/models/correspondencia.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CaptchaService, CaptchaResponse } from '../../../captcha/captcha.service';

type Estado = 'idle' | 'loading' | 'found' | 'not_found' | 'error';

const CITE_REGEX = /^[A-Z]{2,10}-\d{1,6}-\d{4}$/;

@Component({
  selector: 'app-seguimiento-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seguimiento-panel.component.html',
  styles: [`
    .seg-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,.55);
      z-index: 9998;
      animation: segFadeIn .2s ease;
    }
    @keyframes segFadeIn { from { opacity:0 } to { opacity:1 } }

    .seg-modal {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 94%; max-width: 560px;
      max-height: 90vh;
      background: #fff;
      border-radius: 16px;
      z-index: 9999;
      display: flex; flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,.25);
      animation: segPopIn .22s ease;
      overflow: hidden;
    }
    @keyframes segPopIn {
      from { opacity:0; transform: translate(-50%, -48%) scale(.96) }
      to   { opacity:1; transform: translate(-50%, -50%) scale(1) }
    }

    .seg-modal-header {
      display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
      padding: 24px 24px 18px;
      border-bottom: 1px solid var(--ztc-border-border-1, #f0f0f0);
    }
    .seg-modal-title { display: flex; align-items: flex-start; gap: 14px; }
    .seg-icon-wrap {
      width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0;
      background: var(--ztc-bg-bg-13, #E6ECF7);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; color: var(--color-brand-secondary, #0145AC);
    }
    .seg-modal-title h4 {
      font-size: 17px; font-weight: 700; margin: 0 0 3px;
      color: var(--ztc-text-text-5, #142637);
    }
    .seg-modal-title p {
      font-size: 13px; color: var(--ztc-text-text-6, #525455); margin: 0;
    }
    .seg-btn-close {
      background: none; border: none; cursor: pointer;
      font-size: 18px; color: var(--ztc-text-text-6, #525455);
      padding: 4px 6px; border-radius: 6px; transition: all .15s; flex-shrink: 0;
    }
    .seg-btn-close:hover { background: var(--ztc-bg-bg-1, #F3F5F7); color: var(--ztc-text-text-2, #C90F16); }

    .seg-modal-body {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
    }

    .seg-input-group {
      display: flex; gap: 8px; margin-bottom: 10px;
    }
    .seg-input-group input {
      flex: 1; padding: 12px 16px;
      border: 1.5px solid var(--ztc-border-border-2, #dfdcdc);
      border-radius: 8px; font-size: 14px;
      font-family: 'Courier New', monospace;
      text-transform: uppercase; letter-spacing: .5px;
      outline: none; transition: border-color .2s;
    }
    .seg-input-group input:focus { border-color: var(--color-brand-secondary, #0145AC); }
    .seg-input-group input.is-invalid { border-color: #dc3545; }
    .seg-input-group button {
      padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer;
      font-weight: 600; font-size: 14px; white-space: nowrap;
      background: var(--color-brand-secondary, #0145AC); color: #fff;
      transition: opacity .2s; display: flex; align-items: center; gap: 6px;
    }
    .seg-input-group button:disabled { opacity: .6; cursor: not-allowed; }
    .seg-input-group button:not(:disabled):hover { opacity: .88; }

    .seg-field-error { font-size: 12px; color: #dc3545; margin: 0 0 8px; }

    .seg-hint {
      font-size: 12px; color: var(--ztc-text-text-8, #5F5C5A);
      margin: 0 0 20px; display: flex; align-items: flex-start; gap: 6px;
    }

    .seg-alert {
      border-radius: 8px; padding: 12px 14px; font-size: 13px;
      margin-bottom: 14px; display: flex; align-items: flex-start; gap: 8px;
    }
    .seg-alert.danger  { background: #fff5f5; border: 1px solid #fecaca; color: #b91c1c; }
    .seg-alert.warning { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; }

    .seg-loading {
      text-align: center; padding: 40px 20px;
      color: var(--ztc-text-text-6, #525455); font-size: 14px;
    }
    .seg-spinner {
      width: 34px; height: 34px; margin: 0 auto 12px;
      border: 3px solid var(--ztc-border-border-1, #f0f0f0);
      border-top-color: var(--color-brand-secondary, #0145AC);
      border-radius: 50%; animation: segSpin .7s linear infinite;
    }
    @keyframes segSpin { to { transform: rotate(360deg) } }

    .seg-empty {
      text-align: center; padding: 36px 20px;
      color: var(--ztc-text-text-6, #525455);
    }
    .seg-empty > i { font-size: 48px; opacity: .2; display: block; margin-bottom: 12px; }
    .seg-empty h5 { font-size: 16px; font-weight: 700; color: var(--ztc-text-text-5, #142637); margin-bottom: 6px; }
    .seg-empty p  { font-size: 14px; margin-bottom: 20px; }

    .seg-result {}
    .seg-result-header {
      background: var(--color-brand-secondary, #0145AC);
      border-radius: 10px; padding: 16px 20px; margin-bottom: 16px;
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
    }
    .seg-cite {
      font-size: 20px; font-weight: 700; color: #fff;
      font-family: 'Courier New', monospace; letter-spacing: .5px;
    }
    .seg-estado-badge {
      background: rgba(255,255,255,.2); color: #fff;
      border-radius: 50px; padding: 3px 14px;
      font-size: 12px; font-weight: 600; letter-spacing: .3px;
    }
    .seg-result-grid {
      border: 1px solid var(--ztc-border-border-1, #f0f0f0);
      border-radius: 10px; overflow: hidden; margin-bottom: 16px;
    }
    .seg-row {
      display: flex; gap: 10px; padding: 11px 16px;
      border-bottom: 1px solid var(--ztc-border-border-1, #f0f0f0);
      font-size: 14px;
    }
    .seg-row:last-child { border-bottom: none; }
    .seg-row:nth-child(even) { background: var(--ztc-bg-bg-1, #F3F5F7); }
    .seg-label {
      font-weight: 600; color: var(--ztc-text-text-5, #142637);
      min-width: 120px; flex-shrink: 0; display: flex; align-items: flex-start; gap: 6px;
    }
    .seg-value { color: var(--ztc-text-text-6, #525455); }
    .seg-sub { display: block; font-size: 12px; color: #aaa; }
    .seg-vencimiento { color: var(--ztc-text-text-9, #EC631A); font-weight: 600; }
    .urgencia-alta  { color: var(--ztc-text-text-2, #C90F16); font-weight: 700; }
    .urgencia-media { color: var(--ztc-bg-bg-7, #EE6400); font-weight: 600; }

    .seg-btn-nueva {
      width: 100%; padding: 12px; border-radius: 8px; cursor: pointer;
      font-weight: 600; font-size: 14px;
      border: 1.5px solid var(--color-brand-secondary, #0145AC);
      background: transparent; color: var(--color-brand-secondary, #0145AC);
      transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .seg-btn-nueva:hover {
      background: var(--color-brand-secondary, #0145AC); color: #fff;
    }

    .seg-btn-buscar {
      width: 100%; padding: 12px; border: none; border-radius: 8px; cursor: pointer;
      font-weight: 600; font-size: 14px;
      background: var(--color-brand-secondary, #0145AC); color: #fff;
      transition: opacity .2s; display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .seg-btn-buscar:disabled { opacity: .6; cursor: not-allowed; }
    .seg-btn-buscar:not(:disabled):hover { opacity: .88; }

    .seg-captcha-row {
      display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
    }
    .seg-captcha-img {
      height: 48px; border-radius: 6px; border: 1px solid var(--ztc-border-border-2, #dfdcdc);
    }
    .seg-captcha-placeholder {
      height: 48px; width: 160px; border-radius: 6px;
      border: 1px solid var(--ztc-border-border-2, #dfdcdc);
      background: var(--ztc-bg-bg-1, #F3F5F7);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; color: var(--ztc-text-text-6, #525455);
    }
    .seg-captcha-refresh {
      background: none; border: none; cursor: pointer; font-size: 16px;
      color: var(--ztc-text-text-6, #525455); padding: 4px 6px;
      border-radius: 6px; transition: color .2s;
    }
    .seg-captcha-refresh:hover:not(:disabled) { color: var(--color-brand-secondary, #0145AC); }
    .seg-captcha-refresh:disabled { opacity: .4; cursor: not-allowed; }
    .seg-captcha-input {
      width: 100%; padding: 11px 14px;
      border: 1.5px solid var(--ztc-border-border-2, #dfdcdc);
      border-radius: 8px; font-size: 14px; outline: none;
      transition: border-color .2s;
    }
    .seg-captcha-input:focus { border-color: var(--color-brand-secondary, #0145AC); }
    .seg-captcha-input.is-invalid { border-color: #dc3545; }

    @media (max-width: 480px) {
      .seg-modal { width: 98%; border-radius: 12px; }
      .seg-modal-header, .seg-modal-body { padding: 18px 16px; }
      .seg-label { min-width: 90px; }
    }
  `]
})
export class SeguimientoPanelComponent {
  private panelSvc = inject(SeguimientoPanelService);
  private corrSvc = inject(CorrespondenciaService);
  private captchaSvc = inject(CaptchaService);
  private fb = inject(FormBuilder);

  readonly isOpen = this.panelSvc.isOpen;

  constructor() {
    effect(() => { if (this.isOpen()) this.loadCaptcha(); });
  }

  estado = signal<Estado>('idle');
  resultado = signal<Correspondencia | null>(null);
  errorMsg = signal<string>('');
  formatoInvalido = signal(false);
  captcha = signal<CaptchaResponse | null>(null);
  captchaLoading = signal(false);

  form = this.fb.group({
    cite: ['', [Validators.required]],
    captcha_value: ['', [Validators.required]],
  });

  get citeCtrl() { return this.form.controls['cite']; }
  get captchaCtrl() { return this.form.controls['captcha_value']; }

  loadCaptcha() {
    this.captchaLoading.set(true);
    this.captchaCtrl.reset('');
    this.captchaSvc.generate().subscribe({
      next: (res) => { this.captcha.set(res); this.captchaLoading.set(false); },
      error: () => { this.captchaLoading.set(false); },
    });
  }

  close() {
    this.panelSvc.close();
    this.nueva();
  }

  nueva() {
    this.estado.set('idle');
    this.resultado.set(null);
    this.errorMsg.set('');
    this.formatoInvalido.set(false);
    this.form.reset();
    this.captcha.set(null);
    this.loadCaptcha();
  }

  consultar() {
    const cite = (this.citeCtrl.value ?? '').trim().toUpperCase();

    if (!cite) { this.form.markAllAsTouched(); return; }

    if (!CITE_REGEX.test(cite)) { this.formatoInvalido.set(true); return; }

    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.formatoInvalido.set(false);
    this.estado.set('loading');

    this.corrSvc.consultar(cite, this.captcha()!.key, this.captchaCtrl.value!).subscribe({
      next: (res) => {
        this.resultado.set(res);
        this.estado.set('found');
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.estado.set('not_found');
        } else if (err.status === 422) {
          this.errorMsg.set('Código de verificación incorrecto.');
          this.estado.set('error');
        } else {
          this.errorMsg.set('El servicio no está disponible en este momento. Intente más tarde.');
          this.estado.set('error');
        }
        this.loadCaptcha();
      },
    });
  }

  urgenciaClass(urgencia: string): string {
    const u = urgencia?.toLowerCase() ?? '';
    if (u.includes('alta') || u.includes('urgente')) return 'urgencia-alta';
    if (u.includes('media')) return 'urgencia-media';
    return '';
  }
}
