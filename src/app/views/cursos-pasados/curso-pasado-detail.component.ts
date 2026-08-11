import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { CursoPasadoService } from '../../cursos-pasados/application/services/curso-pasado.service';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';
import { CursoPasado, ParticipantePasado } from '../../cursos-pasados/domain/models/curso-pasado.model';

interface ChatMsg { text: string; right: boolean; time: string; }

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const mesInicio = MESES[(new Date().getMonth() + 2) % 12];

const MESSAGES: ChatMsg[] = [
    { right: false, time: '09:41', text: '👋 ¡Hola! ¿Necesitás más información sobre este curso?' },
    { right: true,  time: '09:42', text: 'Sí, ¿cómo puedo obtener mi certificado?' },
    { right: false, time: '09:42', text: '📄 Si aprobaste el curso, tu certificado está disponible en el sistema. Contactá a secretaría para gestionarlo.' },
    { right: true,  time: '09:43', text: '¿Cuándo es la próxima edición?' },
    { right: false, time: '09:43', text: `🗓️ La próxima edición está programada para ${mesInicio}. ¡Escribinos para reservar tu lugar!` },
];

@Component({
    selector: 'app-curso-pasado-detail',
    imports: [BreadcrumbComponent, CommonModule, RouterLink, ImageUrlPipe],
    templateUrl: './curso-pasado-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
        .cpd-hero {
            position: relative; min-height: 300px;
            display: flex; align-items: center; overflow: hidden;
            background: #128AA2;
        }
        .cpd-hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .cpd-hero-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(135deg, rgba(18,138,162,0.93) 0%, rgba(4,40,55,0.80) 60%, rgba(252,137,0,0.20) 100%);
        }
        .cpd-hero-pattern {
            position: absolute; inset: 0; z-index: 1; opacity: 0.06;
            background-image: radial-gradient(circle, #fff 1px, transparent 1px);
            background-size: 26px 26px;
        }
        .cpd-hero-body { position: relative; z-index: 2; width: 100%; padding: 100px 0 52px; }
        .cpd-hero-inner { display: flex; align-items: center; gap: 36px; }
        .cpd-hero-text { flex: 1; min-width: 0; }
        .cpd-hero-badge {
            display: inline-flex; align-items: center; gap: 7px;
            background: rgba(252,137,0,0.15); border: 1px solid rgba(252,137,0,0.35);
            color: #FC8900; font-size: 12px; font-weight: 700;
            letter-spacing: 0.8px; text-transform: uppercase;
            padding: 5px 16px; border-radius: 30px; margin-bottom: 14px;
        }
        .cpd-hero-title {
            font-size: clamp(22px, 3.5vw, 40px); font-weight: 800;
            color: #fff; line-height: 1.2; margin-bottom: 18px;
        }
        .cpd-hero-chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
        .cpd-hero-chip {
            display: inline-flex; align-items: center; gap: 6px;
            background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.18);
            color: rgba(255,255,255,0.90); font-size: 12px; font-weight: 600;
            padding: 5px 14px; border-radius: 20px;
        }
        .cpd-hero-img {
            flex-shrink: 0; width: 280px;
            border-radius: 20px; overflow: hidden;
            border: 2px solid rgba(255,255,255,0.15);
            box-shadow: 0 20px 60px rgba(0,0,0,0.40);
        }
        .cpd-hero-img img { width: 100%; height: 200px; object-fit: cover; display: block; }
        .cpd-hero-img-placeholder {
            width: 100%; height: 200px;
            background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
            display: flex; align-items: center; justify-content: center;
        }
        .cpd-hero-img-placeholder i { font-size: 56px; color: rgba(255,255,255,0.15); }

        .cpd-section { background: #f4f7f9; padding: 60px 0 80px; }
        .cpd-layout { display: grid; grid-template-columns: 1fr 340px; gap: 36px; align-items: start; }

        .cpd-card {
            background: #fff; border-radius: 20px;
            border: 1px solid rgba(18,138,162,0.08);
            box-shadow: 0 4px 24px rgba(18,138,162,0.07);
            overflow: hidden;
        }
        .cpd-card-head {
            padding: 20px 26px 16px;
            border-bottom: 1px solid rgba(18,138,162,0.07);
        }
        .cpd-card-head h3 { font-size: 16px; font-weight: 700; color: #060404; margin: 0; }
        .cpd-card-head p  { font-size: 12px; color: #999; margin: 2px 0 0; }
        .cpd-card-body { padding: 24px 26px; }

        .cpd-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .cpd-info-item {}
        .cpd-info-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #aab; margin-bottom: 5px; }
        .cpd-info-value { font-size: 14px; font-weight: 600; color: #2c2c2c; }
        .cpd-info-value.badge-periodo {
            display: inline-flex; align-items: center; gap: 5px;
            background: rgba(18,138,162,0.08); color: #128AA2;
            font-size: 12px; padding: 3px 12px; border-radius: 20px;
        }
        .cpd-info-value.badge-hours {
            display: inline-flex; align-items: center; gap: 5px;
            background: rgba(252,137,0,0.10); color: #c96f00;
            font-size: 12px; padding: 3px 12px; border-radius: 20px;
        }
        .cpd-info-value.dash { color: #ccc; }

        .cpd-cta-card { background: #fff; border-radius: 20px; overflow: hidden; border: 1px solid rgba(18,138,162,0.08); box-shadow: 0 4px 24px rgba(18,138,162,0.07); }
        .cpd-cta-banner {
            background: linear-gradient(135deg, #128AA2 0%, #0a5570 100%);
            padding: 28px 24px 22px; text-align: center;
        }
        .cpd-cta-icon {
            width: 52px; height: 52px; border-radius: 50%;
            background: rgba(252,137,0,0.20); border: 2px solid rgba(252,137,0,0.40);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 14px; font-size: 22px; color: #FC8900;
        }
        .cpd-cta-banner h4 { font-size: 16px; font-weight: 800; color: #fff; margin: 0 0 6px; }
        .cpd-cta-banner p  { font-size: 12.5px; color: rgba(255,255,255,0.72); margin: 0; line-height: 1.5; }
        .cpd-cta-body { padding: 20px 24px 24px; display: flex; flex-direction: column; gap: 10px; }

        .cpd-btn-primary {
            display: flex; align-items: center; justify-content: center; gap: 8px;
            background: #FC8900; color: #fff; font-size: 13px; font-weight: 700;
            padding: 12px 20px; border-radius: 12px; text-decoration: none;
            transition: background .2s, transform .2s; border: none; cursor: pointer;
            box-shadow: 0 4px 14px rgba(252,137,0,0.30);
        }
        .cpd-btn-primary:hover { background: #e07000; color: #fff; transform: translateY(-2px); }
        .cpd-btn-outline {
            display: flex; align-items: center; justify-content: center; gap: 8px;
            background: transparent; color: #128AA2; font-size: 13px; font-weight: 600;
            padding: 11px 20px; border-radius: 12px; text-decoration: none;
            border: 1.5px solid rgba(18,138,162,0.22); transition: all .2s;
        }
        .cpd-btn-outline:hover { background: #128AA2; color: #fff; }

        .cpd-stat-row {
            display: flex; gap: 16px; margin-top: 16px;
            padding-top: 16px; border-top: 1px solid rgba(18,138,162,0.07);
        }
        .cpd-stat { flex: 1; text-align: center; }
        .cpd-stat-num { font-size: 22px; font-weight: 800; color: #128AA2; display: block; }
        .cpd-stat-lbl { font-size: 10px; font-weight: 600; color: #aab; text-transform: uppercase; letter-spacing: 0.5px; }

        .cpd-back-link {
            display: inline-flex; align-items: center; gap: 6px;
            color: #128AA2; font-size: 13px; font-weight: 600;
            text-decoration: none; margin-bottom: 24px;
            opacity: 0.7; transition: opacity .2s;
        }
        .cpd-back-link:hover { opacity: 1; }

        .cpd-left-col { display: flex; flex-direction: column; }

        .cpd-part-count {
            display: inline-flex; align-items: center; justify-content: center;
            background: rgba(18,138,162,0.10); color: #128AA2;
            font-size: 11px; font-weight: 700;
            min-width: 22px; height: 22px; border-radius: 20px;
            padding: 0 7px; margin-left: 8px; vertical-align: middle;
        }
        .cpd-part-search-wrap {
            position: relative; padding: 14px 24px 10px;
            border-bottom: 1px solid rgba(18,138,162,0.07);
        }
        .cpd-part-search-wrap i {
            position: absolute; left: 38px; top: 50%;
            transform: translateY(-50%);
            color: #128AA2; opacity: 0.40; font-size: 12px;
        }
        .cpd-part-search {
            width: 100%; padding: 8px 12px 8px 34px;
            border: 1.5px solid rgba(18,138,162,0.14); border-radius: 8px;
            font-size: 13px; outline: none; transition: border-color .2s;
            background: #f9fafb;
        }
        .cpd-part-search:focus { border-color: #128AA2; }
        .cpd-part-list { max-height: 420px; overflow-y: auto; }
        .cpd-part-row {
            display: flex; align-items: center; gap: 12px;
            padding: 10px 24px;
            border-bottom: 1px solid rgba(18,138,162,0.05);
            transition: background .15s;
        }
        .cpd-part-row:last-child { border-bottom: none; }
        .cpd-part-row:hover { background: rgba(18,138,162,0.03); }
        .cpd-part-num { font-size: 11px; color: #ccc; min-width: 20px; text-align: right; font-variant-numeric: tabular-nums; }
        .cpd-part-avatar {
            width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
            background: linear-gradient(135deg, #128AA2, #0a6080);
            color: #fff; font-size: 13px; font-weight: 700;
            display: flex; align-items: center; justify-content: center;
        }
        .cpd-part-name { font-size: 13.5px; color: #2c2c2c; font-weight: 500; }
        .cpd-part-empty { text-align: center; padding: 32px 24px; color: #ccc; font-size: 13px; }
        .cpd-part-empty i { font-size: 32px; display: block; margin-bottom: 10px; }

        .cpd-loading { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 80px 0; color: #999; }
        .cpd-loading i { font-size: 20px; animation: cpd-spin 1s linear infinite; }
        @keyframes cpd-spin { to { transform: rotate(360deg); } }

        .cpd-error { text-align: center; padding: 80px 24px; color: #bbb; }
        .cpd-error i { font-size: 48px; margin-bottom: 16px; display: block; color: #dde4e8; }

        .cpd-sidebar-label {
            font-size: 10px; font-weight: 700; letter-spacing: 1.4px;
            text-transform: uppercase; color: #128AA2; opacity: 0.45;
            margin-bottom: 16px; text-align: center;
            display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .cpd-sidebar-label::before,
        .cpd-sidebar-label::after { content: ''; flex: 1; height: 1px; background: rgba(18,138,162,0.12); }

        .wa-phone-wrap { position: relative; max-width: 280px; width: 100%; margin: 0 auto; padding: 0 28px; }

        .wa-float-badge {
            position: absolute; display: flex; align-items: center; gap: 5px;
            font-size: 9.5px; font-weight: 700; padding: 5px 11px;
            border-radius: 20px; white-space: nowrap; z-index: 10;
            box-shadow: 0 4px 16px rgba(0,0,0,0.18); letter-spacing: 0.2px;
        }
        .wa-float-badge--top {
            top: 56px; right: -4px;
            background: #fff; color: #128AA2; border: 1px solid rgba(18,138,162,0.14);
        }
        .wa-float-badge--bot {
            bottom: 60px; left: -4px;
            background: linear-gradient(135deg, #25d366, #1aab54); color: #fff;
        }
        .wa-float-badge i { font-size: 10px; }

        .wa-phone {
            width: 100%; border-radius: 46px;
            background: linear-gradient(160deg, #303033 0%, #1c1c1f 35%, #111113 65%, #0a0a0c 100%);
            padding: 8px 8px 16px; position: relative;
            box-shadow:
                0 0 0 1px rgba(255,255,255,0.10),
                inset 0 1px 0 rgba(255,255,255,0.14),
                0 2px 6px rgba(255,255,255,0.04),
                0 30px 60px rgba(0,0,0,0.60),
                0 60px 100px rgba(0,0,0,0.35);
        }
        
        .wa-phone::after {
            content: ''; position: absolute; right: -3px; top: 120px;
            width: 3px; height: 52px; background: #2a2a2e;
            border-radius: 0 3px 3px 0;
            box-shadow: inset -1px 0 0 rgba(255,255,255,0.06);
        }
        
        .wa-phone-vol {
            position: absolute; left: -3px; top: 100px;
            width: 3px; height: 32px; background: #2a2a2e;
            border-radius: 3px 0 0 3px;
            box-shadow: 0 42px 0 #2a2a2e, 0 80px 0 #2a2a2e,
                        inset 1px 0 0 rgba(255,255,255,0.06);
        }

        .wa-top-chrome { background: #000; border-radius: 38px 38px 0 0; padding-bottom: 2px; }
        .wa-dynamic-island {
            width: 88px; height: 26px; background: #000; border-radius: 20px;
            margin: 6px auto 4px; display: flex; align-items: center; justify-content: center; gap: 6px;
            box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
        }
        .wa-di-camera {
            width: 8px; height: 8px; border-radius: 50%;
            background: radial-gradient(circle at 35% 35%, #243a6a 0%, #0a0a1a 70%);
            box-shadow: 0 0 0 1px rgba(255,255,255,0.08);
        }
        .wa-di-pill { width: 30px; height: 8px; border-radius: 5px; background: #0a0a0d; box-shadow: 0 0 0 1px rgba(255,255,255,0.06); }
        .wa-status-bar { display: flex; justify-content: space-between; align-items: center; padding: 0 14px 4px; }
        .wa-status-time { font-size: 9.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px; }
        .wa-status-icons { display: flex; align-items: center; gap: 4px; color: #fff; font-size: 8px; }
        .wa-battery-body {
            width: 18px; height: 9px; border: 1.5px solid rgba(255,255,255,0.75); border-radius: 2.5px;
            position: relative; display: flex; align-items: center; padding: 1.5px;
        }
        .wa-battery-body::after {
            content: ''; position: absolute; right: -3px; top: 50%; transform: translateY(-50%);
            width: 2px; height: 5px; background: rgba(255,255,255,0.55); border-radius: 0 1px 1px 0;
        }
        .wa-battery-fill { height: 100%; width: 68%; background: #4cd964; border-radius: 1px; }

        .wa-screen { border-radius: 30px; overflow: hidden; display: flex; flex-direction: column; height: 440px; background: #111; }

        .wa-topbar {
            background: linear-gradient(90deg, #075E54 0%, #0a7363 100%);
            padding: 8px 12px 9px; display: flex; align-items: center; gap: 9px; flex-shrink: 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.25);
        }
        .wa-back { color: rgba(255,255,255,0.85); font-size: 13px; }
        .wa-avatar {
            width: 32px; height: 32px; border-radius: 50%;
            background: linear-gradient(135deg, #FC8900 0%, #e06800 100%);
            display: flex; align-items: center; justify-content: center; flex-shrink: 0;
            border: 2px solid rgba(255,255,255,0.25);
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .wa-avatar i { font-size: 13px; color: #fff; }
        .wa-contact-info { flex: 1; min-width: 0; }
        .wa-contact-name { font-size: 12px; font-weight: 700; color: #fff; line-height: 1.2; }
        .wa-contact-status { font-size: 9.5px; color: rgba(255,255,255,0.78); display: flex; align-items: center; gap: 4px; margin-top: 1px; }
        .wa-contact-status::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #4ade80; display: inline-block; box-shadow: 0 0 4px rgba(74,222,128,0.6); }
        .wa-topbar-actions { display: flex; gap: 16px; color: rgba(255,255,255,0.85); font-size: 13px; }

        .wa-transition-wrap { flex: 1; position: relative; overflow: hidden; min-height: 0; }
        .wa-transition-wrap > * { position: absolute; inset: 0; }

        .wa-gif-screen {
            position: absolute; inset: 0; display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            background: linear-gradient(160deg, #0d2a26 0%, #0e3028 50%, #07201d 100%);
            gap: 12px; padding: 20px; opacity: 1; transition: opacity 0.7s ease; z-index: 2;
        }
        .wa-gif-screen.fading { opacity: 0; }
        .wa-gif-logo-wrap {
            width: 110px; height: 110px; border-radius: 50%;
            background: rgba(255,255,255,0.06);
            border: 2px solid rgba(255,255,255,0.10);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 0 40px rgba(7,94,84,0.5), 0 0 0 8px rgba(255,255,255,0.03);
        }
        .wa-gif-logo-wrap img { width: 80px; height: 80px; object-fit: contain; }
        .wa-gif-title { font-size: 11px; font-weight: 700; color: #fff; letter-spacing: 0.3px; }
        .wa-gif-sub { font-size: 9.5px; color: rgba(255,255,255,0.45); letter-spacing: 0.3px; }
        .wa-gif-progress { width: 72%; height: 2px; background: rgba(255,255,255,0.10); border-radius: 2px; overflow: hidden; }
        .wa-gif-progress-bar { height: 100%; width: 0%; background: #25d366; border-radius: 2px; }
        .wa-gif-progress-bar.running { animation: gifProgress 14s linear forwards; }

        .wa-body {
            position: absolute; inset: 0; opacity: 0; transition: opacity 0.7s ease; pointer-events: none;
            background-color: #e5ddd5;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg fill='none' opacity='0.4'%3E%3Cpath stroke='%23c8bfb5' stroke-width='0.5' d='M20 20 L60 20 L60 60 L20 60 Z'/%3E%3Ccircle cx='40' cy='40' r='8' stroke='%23c8bfb5' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E");
            background-size: 40px 40px;
        }
        .wa-body.visible { opacity: 1; pointer-events: auto; }
        .wa-date-chip { text-align: center; margin: 6px 0 4px; }
        .wa-date-chip span {
            display: inline-block; background: rgba(225,245,254,0.90);
            backdrop-filter: blur(4px);
            color: #546e7a; font-size: 8.5px; padding: 2px 10px; border-radius: 7px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.10);
        }
        .wa-messages { display: flex; flex-direction: column; gap: 4px; padding: 6px 10px 6px; height: 100%; overflow: hidden; justify-content: flex-end; }

        .wa-msg {
            max-width: 82%; padding: 6px 10px 4px; border-radius: 8px;
            font-size: 10.5px; line-height: 1.55; position: relative;
            word-break: break-word; white-space: pre-line;
            animation: waBubbleIn 0.22s cubic-bezier(.34,1.3,.64,1) both;
        }
        .wa-msg.left {
            background: #fff; color: #111b21; align-self: flex-start;
            border-top-left-radius: 2px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.12);
        }
        .wa-msg.left::before {
            content: ''; position: absolute; top: 0; left: -7px;
            border-style: solid; border-width: 0 8px 8px 0; border-color: transparent #fff transparent transparent;
        }
        .wa-msg.right {
            background: #d9f7be; color: #111b21; align-self: flex-end;
            border-top-right-radius: 2px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.10);
        }
        .wa-msg.right::before {
            content: ''; position: absolute; top: 0; right: -7px;
            border-style: solid; border-width: 8px 8px 0 0; border-color: #d9f7be transparent transparent transparent;
        }
        .wa-msg-meta { display: flex; align-items: center; justify-content: flex-end; gap: 3px; margin-top: 2px; float: right; margin-left: 6px; margin-bottom: -2px; }
        .wa-msg-time { font-size: 8px; color: rgba(0,0,0,0.36); }
        .wa-msg-ticks { font-size: 10px; color: #53bdeb; }

        .wa-typing {
            background: #fff; border-radius: 8px; border-top-left-radius: 2px;
            align-self: flex-start; padding: 9px 13px 8px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.12);
            animation: waBubbleIn 0.22s ease both; position: relative;
        }
        .wa-typing::before {
            content: ''; position: absolute; top: 0; left: -7px;
            border-style: solid; border-width: 0 8px 8px 0; border-color: transparent #fff transparent transparent;
        }
        .wa-typing-dots { display: flex; gap: 4px; align-items: center; }
        .wa-typing-dots span { width: 7px; height: 7px; border-radius: 50%; background: #b0bec5; animation: waDot 1.3s infinite ease-in-out; }
        .wa-typing-dots span:nth-child(2) { animation-delay: 0.18s; }
        .wa-typing-dots span:nth-child(3) { animation-delay: 0.36s; }

        .wa-inputbar {
            background: #f0f2f0; padding: 6px 8px 8px; display: flex; align-items: center; gap: 6px; flex-shrink: 0;
            border-top: 1px solid rgba(0,0,0,0.05);
        }
        .wa-inputbar-field {
            flex: 1; background: #fff; border-radius: 22px; padding: 7px 12px;
            font-size: 10px; color: #aaa; display: flex; align-items: center; gap: 7px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.06);
        }
        .wa-inputbar-field span { flex: 1; }
        .wa-inputbar-send {
            width: 34px; height: 34px; background: linear-gradient(135deg, #075E54, #0a7363);
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            color: #fff; font-size: 12px; flex-shrink: 0;
            box-shadow: 0 2px 8px rgba(7,94,84,0.4);
        }

        @keyframes gifProgress { from { width: 0%; } to { width: 100%; } }
        @keyframes waDot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.35; } 30% { transform: translateY(-5px); opacity: 1; } }
        @keyframes waBubbleIn { from { opacity: 0; transform: scale(0.9) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }

        .cpd-logos-section { background: #fff; border-top: 1px solid rgba(18,138,162,0.07); padding: 36px 0; }
        .cpd-logos-label {
            text-align: center; font-size: 10.5px; font-weight: 700;
            letter-spacing: 1.4px; text-transform: uppercase;
            color: #128AA2; opacity: 0.45; margin-bottom: 28px;
            display: flex; align-items: center; justify-content: center; gap: 12px;
        }
        .cpd-logos-label::before,
        .cpd-logos-label::after { content: ''; flex: 1; max-width: 80px; height: 1px; background: rgba(18,138,162,0.12); }
        .cpd-logos-strip {
            display: flex; flex-wrap: wrap;
            justify-content: center; align-items: center;
            gap: 16px 24px;
        }
        .cpd-logo-item {
            display: flex; align-items: center; justify-content: center;
            width: 300px; height: 190px;
            background: #fff; border-radius: 16px;
            border: 1px solid rgba(18,138,162,0.08);
            box-shadow: 0 2px 10px rgba(18,138,162,0.06);
            padding: 18px 24px;
            transition: transform .25s, box-shadow .25s;
            animation: cpd-logo-pulse 3s ease-in-out infinite;
        }
        .cpd-logo-item:nth-child(2) { animation-delay: 0.4s; }
        .cpd-logo-item:nth-child(3) { animation-delay: 0.8s; }
        .cpd-logo-item:nth-child(4) { animation-delay: 1.2s; }
        .cpd-logo-item:nth-child(5) { animation-delay: 1.6s; }
        .cpd-logo-item:nth-child(6) { animation-delay: 2.0s; }
        .cpd-logo-item:hover {
            transform: translateY(-4px) scale(1.03);
            box-shadow: 0 12px 32px rgba(18,138,162,0.15);
            animation-play-state: paused;
        }
        .cpd-logo-item img { max-width: 100%; max-height: 100%; object-fit: contain; filter: grayscale(20%); transition: filter .25s; }
        .cpd-logo-item:hover img { filter: grayscale(0%); }
        @keyframes cpd-logo-pulse {
            0%, 100% { box-shadow: 0 2px 10px rgba(18,138,162,0.06); transform: translateY(0); }
            50%       { box-shadow: 0 6px 22px rgba(18,138,162,0.13); transform: translateY(-4px); }
        }

        @media (max-width: 900px) {
            .cpd-layout { grid-template-columns: 1fr; }
            .cpd-hero-img { display: none; }
        }
        @media (max-width: 575px) {
            .cpd-info-grid { grid-template-columns: 1fr; }
            .cpd-hero-body { padding: 80px 0 40px; }
        }
    `]
})
export class CursoPasadoDetailComponent implements OnInit, OnDestroy {
    private service = inject(CursoPasadoService);
    private route   = inject(ActivatedRoute);
    private router  = inject(Router);
    private cdr     = inject(ChangeDetectorRef);

    curso:    CursoPasado | null = null;
    cargando = true;

    private filtroParticipantes = '';

    showGif   = true;
    gifFading = false;
    visibleMsgs: ChatMsg[] = [];
    showTyping = false;
    private step = 0;
    private timers: ReturnType<typeof setTimeout>[] = [];
    readonly GIF_MS = 14000;
    private sub: Subscription | null = null;

    get participantesFiltrados(): ParticipantePasado[] {
        const lista = this.curso?.participantes ?? [];
        const q = this.filtroParticipantes.toLowerCase();
        return q ? lista.filter(p => p.nombre_completo.toLowerCase().includes(q)) : lista;
    }

    onFilterParticipantes(e: Event): void {
        this.filtroParticipantes = (e.target as HTMLInputElement).value.trim();
        this.cdr.detectChanges();
    }

    ngOnInit(): void {
        this.sub = this.route.paramMap.pipe(
            switchMap(params => {
                this.curso = null;
                this.cargando = true;
                this.cdr.detectChanges();
                return this.service.getBySlug(params.get('slug') ?? '');
            })
        ).subscribe({
            next: (data) => {
                this.curso    = data;
                this.cargando = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.router.navigate(['/404'], { replaceUrl: true });
            }
        });

        this.after(this.GIF_MS, () => {
            this.gifFading = true;
            this.cdr.markForCheck();
            this.after(600, () => {
                this.showGif = false;
                this.cdr.markForCheck();
                this.scheduleNext();
            });
        });
    }

    ngOnDestroy(): void { this.timers.forEach(t => clearTimeout(t)); this.sub?.unsubscribe(); }

    private after(ms: number, fn: () => void): void { this.timers.push(setTimeout(fn, ms)); }

    private scheduleNext(): void {
        if (this.step >= MESSAGES.length) {
            this.after(3500, () => {
                this.visibleMsgs = []; this.step = 0;
                this.showGif = true; this.gifFading = false;
                this.cdr.markForCheck();
                this.after(this.GIF_MS, () => {
                    this.gifFading = true; this.cdr.markForCheck();
                    this.after(600, () => { this.showGif = false; this.cdr.markForCheck(); this.scheduleNext(); });
                });
            });
            return;
        }
        const msg = MESSAGES[this.step];
        if (!msg.right) {
            this.after(600, () => {
                this.showTyping = true; this.cdr.markForCheck();
                this.after(900, () => {
                    this.showTyping = false;
                    this.visibleMsgs = [...this.visibleMsgs, msg];
                    this.step++; this.cdr.markForCheck(); this.scheduleNext();
                });
            });
        } else {
            this.after(1200, () => {
                this.visibleMsgs = [...this.visibleMsgs, msg];
                this.step++; this.cdr.markForCheck(); this.scheduleNext();
            });
        }
    }

}
