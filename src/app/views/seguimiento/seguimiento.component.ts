import { Component, inject, signal, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CertificadoService } from '../../certificados/application/services/certificado.service';
import { Certificado } from '../../certificados/domain/models/certificado.model';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';

type Estado = 'idle' | 'loading' | 'found' | 'not_found' | 'error';

const CODIGO_REGEX = /^[A-Z0-9\-]{4,50}$/;

@Component({
    selector: 'app-seguimiento',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent, ImageUrlPipe],
    templateUrl: './seguimiento.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
        .vc-hero {
            position: relative;
            min-height: 360px;
            display: flex;
            align-items: center;
            overflow: hidden;
            background: #128AA2;
        }
        .vc-hero-bg {
            position: absolute; inset: 0;
            width: 100%; height: 100%;
            object-fit: cover; opacity: 0.18;
        }
        .vc-hero-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(135deg, rgba(18,138,162,0.97) 0%, rgba(4,40,55,0.90) 60%, rgba(252,137,0,0.18) 100%);
        }
        .vc-hero-pattern {
            position: absolute; inset: 0; opacity: 0.04;
            background-image: radial-gradient(circle, #fff 1px, transparent 1px);
            background-size: 28px 28px;
        }
        .vc-hero-body {
            position: relative; z-index: 1;
            padding: 64px 0 56px; width: 100%;
        }
        .vc-hero-inner {
            display: flex; align-items: center; gap: 48px;
            flex-wrap: wrap;
        }
        .vc-hero-text { flex: 1; min-width: 260px; }
        .vc-hero-badge {
            display: inline-flex; align-items: center; gap: 8px;
            background: rgba(252,137,0,0.15); color: #FC8900;
            font-size: 11.5px; font-weight: 800; letter-spacing: 0.8px;
            text-transform: uppercase;
            padding: 6px 18px; border-radius: 20px;
            border: 1px solid rgba(252,137,0,0.35); margin-bottom: 18px;
        }
        .vc-hero-title {
            font-size: clamp(28px, 4vw, 48px); font-weight: 900;
            color: #fff; line-height: 1.1; margin-bottom: 14px;
            letter-spacing: -0.5px;
        }
        .vc-hero-title span { color: #FC8900; }
        .vc-hero-subtitle {
            font-size: 15px; color: rgba(255,255,255,0.65);
            line-height: 1.65; max-width: 480px; margin-bottom: 24px;
        }
        .vc-hero-pills {
            display: flex; flex-wrap: wrap; gap: 8px;
        }
        .vc-hero-pill {
            display: inline-flex; align-items: center; gap: 6px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.14);
            color: rgba(255,255,255,0.80); font-size: 12px; font-weight: 600;
            padding: 6px 14px; border-radius: 20px;
        }
        .vc-hero-pill i { color: #FC8900; font-size: 11px; }

        .vc-hero-deco {
            flex-shrink: 0; width: 280px;
        }
        .vc-hero-deco-card {
            background: rgba(255,255,255,0.07);
            border: 1px solid rgba(255,255,255,0.12);
            backdrop-filter: blur(12px);
            border-radius: 18px; padding: 24px 22px;
        }
        .vc-deco-header {
            display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
        }
        .vc-deco-icon {
            width: 40px; height: 40px; border-radius: 10px;
            background: #FC8900; display: flex; align-items: center;
            justify-content: center; color: #fff; font-size: 18px;
        }
        .vc-deco-header h5 {
            font-size: 13px; font-weight: 700; color: #fff; margin: 0 0 2px;
        }
        .vc-deco-header p { font-size: 11px; color: rgba(255,255,255,0.5); margin: 0; }
        .vc-deco-format {
            background: rgba(255,255,255,0.06); border-radius: 10px;
            padding: 14px 16px; margin-bottom: 14px; text-align: center;
        }
        .vc-deco-format p { font-size: 10px; color: rgba(255,255,255,0.45); margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px; }
        .vc-deco-format code {
            font-family: 'Courier New', monospace;
            font-size: 18px; font-weight: 800; color: #FC8900; letter-spacing: 2px;
        }
        .vc-deco-example {
            text-align: center; font-size: 11px; color: rgba(255,255,255,0.40);
            font-family: 'Courier New', monospace; letter-spacing: 1px;
        }

        .vc-section {
            background: #f0f4f7;
            padding: 0 0 72px;
            position: relative;
        }
        .vc-section::before {
            content: '';
            display: block;
            height: 56px;
            background: linear-gradient(180deg, #128AA2 0%, #f0f4f7 100%);
        }

        .vc-layout {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 24px;
            align-items: start;
        }
        @media (max-width: 991px) {
            .vc-layout { grid-template-columns: 1fr; }
            .vc-hero-deco { display: none; }
            .vc-hero-body { padding: 40px 0 36px; }
        }

        .vc-side-card {
            background: #fff;
            border-radius: 16px;
            border: 1px solid rgba(18,138,162,0.07);
            box-shadow: 0 2px 16px rgba(18,138,162,0.06);
            overflow: hidden;
            margin-bottom: 16px;
        }
        .vc-side-head {
            background: linear-gradient(135deg, #128AA2 0%, #0a5a7a 100%);
            padding: 16px 20px;
            display: flex; align-items: center; gap: 12px;
        }
        .vc-side-head-icon {
            width: 36px; height: 36px; border-radius: 9px;
            background: rgba(252,137,0,0.20);
            border: 1px solid rgba(252,137,0,0.35);
            display: flex; align-items: center; justify-content: center;
            color: #FC8900; font-size: 15px; flex-shrink: 0;
        }
        .vc-side-head h4 { font-size: 14px; font-weight: 700; color: #fff; margin: 0 0 1px; }
        .vc-side-head p { font-size: 11.5px; color: rgba(255,255,255,0.55); margin: 0; }
        .vc-side-body { padding: 18px 20px; }

        .vc-steps { list-style: none; padding: 0; margin: 0; }
        .vc-step {
            display: flex; gap: 12px; align-items: flex-start;
            padding: 11px 0; border-bottom: 1px solid rgba(18,138,162,0.05);
        }
        .vc-step:last-child { border-bottom: none; padding-bottom: 0; }
        .vc-step-num {
            width: 26px; height: 26px; border-radius: 50%;
            background: linear-gradient(135deg, #FC8900, #e67a00);
            color: #fff; font-size: 11px; font-weight: 800;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0; margin-top: 1px;
            box-shadow: 0 2px 8px rgba(252,137,0,0.35);
        }
        .vc-step span { font-size: 13px; color: #555; line-height: 1.55; }

        .vc-fmt-row {
            display: flex; align-items: flex-start; gap: 12px;
            padding: 12px 0; border-bottom: 1px solid rgba(18,138,162,0.05);
        }
        .vc-fmt-row:last-child { border-bottom: none; padding-bottom: 0; }
        .vc-fmt-icon {
            width: 34px; height: 34px; border-radius: 8px;
            background: rgba(18,138,162,0.06);
            display: flex; align-items: center; justify-content: center;
            color: #128AA2; font-size: 13px; flex-shrink: 0; margin-top: 1px;
        }
        .vc-fmt-text label {
            display: block; font-size: 10.5px; font-weight: 700;
            color: #aaa; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;
        }
        .vc-fmt-text code {
            font-family: 'Courier New', monospace; font-size: 13.5px;
            font-weight: 700; color: #128AA2; letter-spacing: 1px;
            background: rgba(18,138,162,0.06); padding: 2px 9px; border-radius: 5px;
        }
        .vc-fmt-text span { font-size: 12.5px; color: #666; line-height: 1.5; }

        .vc-main-card {
            background: #fff;
            border-radius: 20px;
            border: 1px solid rgba(18,138,162,0.07);
            box-shadow: 0 8px 40px rgba(18,138,162,0.10);
            overflow: hidden;
        }
        .vc-card-top {
            background: linear-gradient(135deg, #128AA2 0%, #0a5a7a 100%);
            padding: 24px 32px;
            display: flex; align-items: center; justify-content: space-between;
            flex-wrap: wrap; gap: 12px;
        }
        .vc-card-top-left { display: flex; align-items: center; gap: 14px; }
        .vc-card-top-icon {
            width: 48px; height: 48px; border-radius: 13px;
            background: rgba(252,137,0,0.20);
            border: 1.5px solid rgba(252,137,0,0.40);
            display: flex; align-items: center; justify-content: center;
            color: #FC8900; font-size: 20px;
        }
        .vc-card-top h3 { font-size: 17px; font-weight: 800; color: #fff; margin: 0 0 3px; }
        .vc-card-top p { font-size: 12.5px; color: rgba(255,255,255,0.60); margin: 0; }
        .vc-card-top-secure {
            display: flex; align-items: center; gap: 6px;
            background: rgba(255,255,255,0.10);
            border: 1px solid rgba(255,255,255,0.18);
            color: rgba(255,255,255,0.75); font-size: 11.5px; font-weight: 600;
            padding: 6px 14px; border-radius: 20px;
        }
        .vc-card-top-secure i { color: #4ade80; font-size: 11px; }

        .vc-card-body { padding: 36px 32px 32px; }
        @media (max-width: 575px) {
            .vc-card-body { padding: 24px 20px 20px; }
            .vc-card-top { padding: 18px 20px; }
        }

        .vc-field { margin-bottom: 24px; }
        .vc-label {
            display: flex; align-items: center; gap: 6px;
            font-size: 13px; font-weight: 700; color: #128AA2; margin-bottom: 9px;
        }
        .vc-label-req {
            width: 6px; height: 6px; border-radius: 50%;
            background: #FC8900; flex-shrink: 0;
        }
        .vc-input-wrap { position: relative; }
        .vc-input-icon {
            position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
            color: #aaa; font-size: 14px; pointer-events: none;
            transition: color .2s;
        }
        .vc-input {
            width: 100%; padding: 13px 16px 13px 42px;
            border-radius: 12px;
            border: 1.5px solid rgba(18,138,162,0.15);
            font-size: 15px; color: #1a1a1a; background: #fafbfc;
            outline: none; transition: border-color .2s, box-shadow .2s, background .2s;
            font-family: 'Courier New', monospace; letter-spacing: 1.5px;
        }
        .vc-input::placeholder { font-family: inherit; letter-spacing: 0; color: #c0c7cc; font-size: 13px; }
        .vc-input:focus {
            border-color: #128AA2;
            box-shadow: 0 0 0 4px rgba(18,138,162,0.08);
            background: #fff;
        }
        .vc-input:focus ~ .vc-input-icon { color: #128AA2; }
        .vc-input.is-invalid { border-color: #e53e3e; box-shadow: 0 0 0 4px rgba(229,62,62,0.08); }
        .vc-input-normal {
            font-family: inherit; letter-spacing: 0; font-size: 14px;
        }
        .vc-error-msg {
            display: flex; align-items: center; gap: 6px;
            font-size: 12px; color: #e53e3e; margin-top: 7px; font-weight: 500;
        }

        .vc-captcha-box {
            background: #f8fafb; border-radius: 12px;
            border: 1.5px solid rgba(18,138,162,0.10);
            padding: 16px 18px;
        }
        .vc-captcha-label {
            font-size: 11px; font-weight: 700; color: #aaa;
            text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
        }
        .vc-captcha-row {
            display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
        }
        .vc-captcha-img {
            height: 52px; border-radius: 8px;
            border: 1.5px solid rgba(18,138,162,0.12); background: #fff;
            box-shadow: 0 2px 8px rgba(18,138,162,0.06);
        }
        .vc-captcha-placeholder {
            height: 52px; width: 170px; border-radius: 8px;
            background: linear-gradient(90deg, #eef0f2 25%, #e4e7ea 50%, #eef0f2 75%);
            background-size: 200% 100%;
            animation: vc-shimmer 1.4s ease-in-out infinite;
        }
        .vc-refresh-btn {
            width: 40px; height: 40px; border-radius: 10px;
            background: #fff; border: 1.5px solid rgba(18,138,162,0.14);
            color: #128AA2; font-size: 15px; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all .2s; flex-shrink: 0;
            box-shadow: 0 1px 4px rgba(18,138,162,0.06);
        }
        .vc-refresh-btn:hover:not(:disabled) {
            background: #128AA2; color: #fff; border-color: #128AA2;
            box-shadow: 0 4px 12px rgba(18,138,162,0.25);
        }
        .vc-refresh-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .vc-alert {
            display: flex; align-items: flex-start; gap: 12px;
            padding: 14px 18px; border-radius: 12px;
            font-size: 13.5px; margin-bottom: 20px; line-height: 1.55;
        }
        .vc-alert-icon {
            width: 32px; height: 32px; border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            font-size: 15px; flex-shrink: 0;
        }
        .vc-alert-danger {
            background: #fff5f5; border: 1px solid #fed7d7; color: #742a2a;
        }
        .vc-alert-danger .vc-alert-icon { background: #fed7d7; color: #e53e3e; }
        .vc-alert-warning {
            background: #fffbeb; border: 1px solid #fde68a; color: #78350f;
        }
        .vc-alert-warning .vc-alert-icon { background: #fde68a; color: #d97706; }

        .vc-submit-btn {
            width: 100%; padding: 15px 24px; border-radius: 12px;
            background: linear-gradient(135deg, #FC8900 0%, #128AA2 100%);
            border: none; color: #fff; font-size: 15.5px; font-weight: 800;
            cursor: pointer; display: flex; align-items: center;
            justify-content: center; gap: 10px;
            transition: opacity .25s, transform .2s, box-shadow .2s;
            box-shadow: 0 4px 20px rgba(18,138,162,0.22);
            letter-spacing: 0.3px;
        }
        .vc-submit-btn:hover:not(:disabled) {
            opacity: 0.93; transform: translateY(-2px);
            box-shadow: 0 8px 28px rgba(18,138,162,0.30);
        }
        .vc-submit-btn:disabled { opacity: 0.50; cursor: not-allowed; transform: none; }

        .vc-result-banner {
            background: linear-gradient(135deg, #128AA2 0%, #0a5a7a 100%);
            padding: 24px 32px;
            display: flex; align-items: center; justify-content: space-between;
            flex-wrap: wrap; gap: 14px;
        }
        .vc-result-banner-left { display: flex; align-items: center; gap: 14px; }
        .vc-result-check {
            width: 48px; height: 48px; border-radius: 50%;
            background: rgba(74,222,128,0.20);
            border: 2px solid rgba(74,222,128,0.50);
            display: flex; align-items: center; justify-content: center;
            color: #4ade80; font-size: 22px;
        }
        .vc-result-banner-title { font-size: 17px; font-weight: 800; color: #fff; margin: 0 0 3px; }
        .vc-result-banner-sub { font-size: 12px; color: rgba(255,255,255,0.55); margin: 0; }
        .vc-result-state-badge {
            background: rgba(252,137,0,0.20);
            border: 1px solid rgba(252,137,0,0.45);
            color: #FC8900; font-size: 12px; font-weight: 800;
            padding: 6px 18px; border-radius: 20px;
            text-transform: uppercase; letter-spacing: 0.5px;
        }

        .vc-result-body { padding: 28px 32px 32px; }
        @media (max-width: 575px) {
            .vc-result-body { padding: 20px 18px; }
            .vc-result-banner { padding: 18px 20px; }
        }

        .vc-cite-chip {
            display: inline-flex; align-items: center; gap: 10px;
            background: rgba(18,138,162,0.06); border: 1px solid rgba(18,138,162,0.12);
            border-radius: 10px; padding: 10px 18px; margin-bottom: 22px;
        }
        .vc-cite-chip i { color: #FC8900; font-size: 15px; }
        .vc-cite-chip span {
            font-family: 'Courier New', monospace; font-size: 17px;
            font-weight: 800; color: #128AA2; letter-spacing: 2px;
        }

        .vc-result-grid {
            border: 1px solid rgba(18,138,162,0.08);
            border-radius: 14px; overflow: hidden; margin-bottom: 24px;
        }
        .vc-rrow {
            display: flex; align-items: flex-start; gap: 0;
            border-bottom: 1px solid rgba(18,138,162,0.06);
        }
        .vc-rrow:last-child { border-bottom: none; }
        .vc-rrow-label {
            display: flex; align-items: center; gap: 8px;
            min-width: 160px; flex-shrink: 0;
            padding: 13px 16px;
            background: rgba(18,138,162,0.03);
            font-size: 12.5px; font-weight: 700; color: #128AA2;
            border-right: 1px solid rgba(18,138,162,0.06);
        }
        .vc-rrow-label i { color: #FC8900; font-size: 13px; width: 16px; text-align: center; }
        .vc-rrow-value {
            padding: 13px 18px; font-size: 13.5px; color: #333;
            line-height: 1.55; flex: 1;
        }
        .vc-rrow-sub { display: block; font-size: 11.5px; color: #aaa; margin-top: 3px; }
        .vc-rrow-alert { color: #FC8900; font-weight: 700; }
        .urgencia-alta  { color: #e53e3e; font-weight: 700; }
        .urgencia-media { color: #d97706; font-weight: 600; }

        @media (max-width: 575px) {
            .vc-rrow { flex-direction: column; }
            .vc-rrow-label { min-width: unset; width: 100%; border-right: none; border-bottom: 1px solid rgba(18,138,162,0.06); }
        }

        .vc-nueva-btn {
            width: 100%; padding: 13px 24px; border-radius: 12px;
            background: transparent; border: 2px solid rgba(18,138,162,0.22);
            color: #128AA2; font-size: 14.5px; font-weight: 700;
            cursor: pointer; display: flex; align-items: center;
            justify-content: center; gap: 8px;
            transition: all .25s;
        }
        .vc-nueva-btn:hover { background: #128AA2; color: #fff; border-color: #128AA2; box-shadow: 0 4px 16px rgba(18,138,162,0.22); }

        @keyframes vc-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        .vc-trust-bar {
            display: flex; align-items: center; justify-content: center;
            gap: 32px; flex-wrap: wrap;
            padding: 18px 0 0; margin-top: 32px;
            border-top: 1px solid rgba(18,138,162,0.08);
        }
        .vc-trust-item {
            display: flex; align-items: center; gap: 7px;
            font-size: 12px; color: #aaa; font-weight: 600;
        }
        .vc-trust-item i { color: #128AA2; font-size: 13px; }

        .vc-cond-aprobado { color: #16a34a; font-weight: 700; }
        .vc-cond-reprobado { color: #e53e3e; font-weight: 700; }

        .vc-download-link {
            display: inline-flex; align-items: center; gap: 7px;
            color: #128AA2; font-weight: 700; font-size: 13px;
            text-decoration: none; padding: 6px 14px; border-radius: 8px;
            background: rgba(18,138,162,0.07); border: 1px solid rgba(18,138,162,0.14);
            transition: all .2s;
        }
        .vc-download-link:hover { background: #128AA2; color: #fff; border-color: #128AA2; }
        .vc-download-link i { color: #FC8900; font-size: 12px; }
        .vc-download-link:hover i { color: #fff; }
    `]
})
export class SeguimientoComponent implements OnInit {
    private certSvc = inject(CertificadoService);
    private cdr = inject(ChangeDetectorRef);
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);

    estado = signal<Estado>('idle');
    resultado = signal<Certificado | null>(null);
    errorMsg = signal<string>('');
    formatoInvalido = signal(false);

    form = this.fb.group({
        codigo: ['', [Validators.required]],
    });

    get codigoCtrl() { return this.form.controls['codigo']; }

    ngOnInit() {
        const codigo = this.route.snapshot.queryParamMap.get('codigo');
        if (codigo) {
            this.form.patchValue({ codigo });
            this.consultar();
        }
    }

    nueva() {
        this.estado.set('idle');
        this.resultado.set(null);
        this.errorMsg.set('');
        this.formatoInvalido.set(false);
        this.form.reset();
    }

    consultar() {
        const codigo = (this.codigoCtrl.value ?? '').trim().toUpperCase();
        if (!codigo) { this.form.markAllAsTouched(); return; }
        if (!CODIGO_REGEX.test(codigo)) { this.formatoInvalido.set(true); return; }

        this.formatoInvalido.set(false);
        this.estado.set('loading');

        this.certSvc.verificar(codigo).subscribe({
            next: (res: Certificado) => {
                this.resultado.set(res);
                this.estado.set('found');
                this.cdr.detectChanges();
            },
            error: (err: HttpErrorResponse) => {
                if (err.status === 404) {
                    this.estado.set('not_found');
                } else {
                    this.errorMsg.set('El servicio no está disponible en este momento. Intentá más tarde.');
                    this.estado.set('error');
                }
                this.cdr.detectChanges();
            },
        });
    }

    condicionClass(condicion: string): string {
        const c = condicion?.toLowerCase() ?? '';
        if (c.includes('aprobado')) return 'vc-cond-aprobado';
        if (c.includes('reprobado') || c.includes('suspendido')) return 'vc-cond-reprobado';
        return '';
    }

}
