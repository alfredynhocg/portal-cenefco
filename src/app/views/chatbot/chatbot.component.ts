import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

interface ChatMsg {
    text: string;
    right: boolean;
    time: string;
}

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const mesInicio = MESES[(new Date().getMonth() + 2) % 12];

const MESSAGES: ChatMsg[] = [
    { right: false, time: '09:41', text: '👋 ¡Hola! Bienvenido/a a CENEFCO.\n¿En qué programa estás interesado/a?' },
    { right: true,  time: '09:42', text: 'Me interesa un diplomado en gestión pública 🎓' },
    { right: false, time: '09:42', text: '¡Perfecto! Tenemos varias opciones con modalidad virtual y pago en cuotas. Te paso el detalle... ✅' },
    { right: true,  time: '09:43', text: '¿Cuándo inicia el próximo módulo?' },
    { right: false, time: '09:43', text: `🗓 El próximo inicio es en ${mesInicio}. ¡Los cupos son limitados, inscribite hoy!` },
];

const CARDS = [
    {
        id: 1,
        icon: 'fa-solid fa-comment-dots',
        duration: 800,
        title: 'Bienvenida y presentación',
        description: 'Nuestro asistente te saluda, se presenta y te guía desde el primer momento para encontrar el programa ideal según tus objetivos.',
        color: '#128AA2',
    },
    {
        id: 2,
        icon: 'fa-solid fa-graduation-cap',
        duration: 1000,
        title: 'Oferta académica',
        description: 'Diplomados, cursos de especialización y programas ejecutivos. Todos con docentes expertos, modalidad virtual y certificación reconocida.',
        color: '#FC8900',
    },
    {
        id: 3,
        icon: 'fa-solid fa-certificate',
        duration: 1200,
        title: 'Certificación y beneficios',
        description: 'Certificado con sello institucional, verificable por QR, constancia de horas y acceso a la red de egresados CENEFCO.',
        color: '#128AA2',
    },
    {
        id: 4,
        icon: 'fa-solid fa-clipboard-list',
        duration: 1400,
        title: 'Inscripción y cupos',
        description: 'Cupos limitados. Inscribite en menos de 10 minutos con pago en cuotas y descuentos por inscripción anticipada.',
        color: '#FC8900',
    },
];

@Component({
    selector: 'app-chatbot',
    imports: [CommonModule, RouterLink, BreadcrumbComponent],
    templateUrl: './chatbot.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
        
        .cb-hero {
            position: relative;
            min-height: 320px;
            display: flex;
            align-items: center;
            overflow: hidden;
            background: #128AA2;
        }
        .cb-hero-bg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
        .cb-hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(18,138,162,0.92) 0%, rgba(4,40,55,0.80) 55%, rgba(252,137,0,0.28) 100%);
            z-index: 1;
        }
        .cb-hero-pattern {
            position: absolute;
            inset: 0;
            z-index: 2;
            opacity: 0.07;
            background-image: radial-gradient(circle, #fff 1px, transparent 1px);
            background-size: 28px 28px;
        }
        .cb-hero-body {
            position: relative;
            z-index: 3;
            width: 100%;
            padding: 100px 0 60px;
        }
        .cb-hero-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 40px;
        }
        .cb-hero-text { flex: 1; min-width: 0; }
        .cb-hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: rgba(252,137,0,0.15);
            border: 1px solid rgba(252,137,0,0.35);
            color: #FC8900;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            padding: 6px 16px;
            border-radius: 30px;
            margin-bottom: 18px;
        }
        .cb-hero-title {
            font-size: clamp(28px, 4vw, 46px);
            font-weight: 800;
            color: #fff;
            line-height: 1.15;
            margin-bottom: 16px;
        }
        .cb-hero-title span { color: #FC8900; }
        .cb-hero-subtitle {
            font-size: 15px;
            color: rgba(255,255,255,0.82);
            line-height: 1.7;
            max-width: 520px;
            margin-bottom: 22px;
        }
        .cb-hero-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 22px;
        }
        .cb-hero-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255,255,255,0.10);
            border: 1px solid rgba(255,255,255,0.18);
            color: rgba(255,255,255,0.90);
            font-size: 12px;
            font-weight: 600;
            padding: 5px 14px;
            border-radius: 20px;
        }
        .cb-hero-deco { flex-shrink: 0; }
        .cb-hero-deco-card {
            background: rgba(255,255,255,0.10);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.18);
            border-radius: 20px;
            padding: 24px 28px;
            min-width: 240px;
        }
        .cb-deco-header {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 14px;
        }
        .cb-deco-icon {
            width: 46px; height: 46px;
            background: rgba(252,137,0,0.18);
            border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            color: #FC8900;
            font-size: 20px;
            flex-shrink: 0;
        }
        .cb-deco-header h5 {
            color: #fff;
            font-size: 14px;
            font-weight: 700;
            margin: 0 0 3px;
        }
        .cb-deco-header p {
            color: rgba(255,255,255,0.65);
            font-size: 11px;
            margin: 0;
        }
        .cb-deco-pills { display: flex; flex-direction: column; gap: 8px; }
        .cb-deco-pill {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: rgba(255,255,255,0.80);
        }
        .cb-deco-pill i { color: #25d366; font-size: 13px; }

        .cb-section {
            background: #f4f7f9;
            padding: 72px 0 80px;
        }
        .cb-layout {
            display: grid;
            grid-template-columns: 320px 1fr 1fr;
            gap: 40px;
            align-items: start;
        }

        .cb-text-col {}
        .cb-section-eyebrow {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #FC8900;
            margin-bottom: 12px;
        }
        .cb-section-title {
            font-size: clamp(22px, 2.5vw, 32px);
            font-weight: 800;
            color: #060404;
            line-height: 1.25;
            margin-bottom: 16px;
        }
        .cb-section-title span { color: #128AA2; }
        .cb-section-desc {
            font-size: 14px;
            color: #5A5454;
            line-height: 1.75;
            margin-bottom: 24px;
        }
        .cb-cta-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 28px;
        }
        .cb-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 11px;
            font-weight: 600;
            padding: 5px 12px;
            border-radius: 20px;
            letter-spacing: 0.3px;
        }
        .cb-badge--wa  { background: rgba(37,211,102,0.10); color: #1a9e5a; border: 1px solid rgba(37,211,102,0.25); }
        .cb-badge--time { background: rgba(252,137,0,0.10); color: #c96f00; border: 1px solid rgba(252,137,0,0.25); }
        .cb-badge--free { background: rgba(18,138,162,0.08);   color: #128AA2; border: 1px solid rgba(18,138,162,0.18); }

        .cb-faq-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #128AA2;
            color: #fff;
            font-size: 13px;
            font-weight: 600;
            padding: 11px 24px;
            border-radius: 30px;
            text-decoration: none;
            transition: background 0.2s, transform 0.2s;
        }
        .cb-faq-btn:hover { background: #055170; color: #fff; transform: translateY(-2px); }

        .cb-stats-row {
            display: flex;
            gap: 24px;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e4eaef;
        }
        .cb-stat { text-align: center; flex: 1; }
        .cb-stat-num {
            font-size: 24px;
            font-weight: 800;
            color: #128AA2;
            line-height: 1;
            display: block;
        }
        .cb-stat-label { font-size: 10px; font-weight: 600; color: #8a9aaa; text-transform: uppercase; letter-spacing: 0.5px; }

        .cb-phone-col {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .wa-phone-wrap {
            position: relative;
            max-width: 270px;
            width: 100%;
            margin: 0 auto;
        }
        .wa-float-badge {
            position: absolute;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 600;
            padding: 6px 14px;
            border-radius: 20px;
            white-space: nowrap;
            z-index: 10;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .wa-float-badge--top { top: 30px; right: -24px; background: #fff; color: #128AA2; border: 1px solid #eaeef2; }
        .wa-float-badge--bot { bottom: 30px; left: -24px; background: #25d366; color: #fff; }
        .wa-float-badge i { font-size: 12px; }

        .wa-phone {
            width: 100%;
            border-radius: 48px;
            background: linear-gradient(145deg, #2a2a2e 0%, #1a1a1d 40%, #111113 70%, #0d0d0f 100%);
            padding: 8px 8px 16px;
            position: relative;
            box-shadow:
                -3px 0 8px rgba(255,255,255,0.04),
                0 0 0 1px rgba(255,255,255,0.08),
                0 1px 0 rgba(255,255,255,0.12) inset,
                0 50px 100px rgba(0,0,0,0.6),
                0 20px 40px rgba(0,0,0,0.4);
        }
        .wa-phone::after {
            content: '';
            position: absolute;
            right: -2px; top: 110px;
            width: 2px; height: 48px;
            background: #2a2a2e;
            border-radius: 0 2px 2px 0;
        }
        .wa-phone-vol {
            position: absolute;
            left: -2px; top: 95px;
            width: 2px; height: 32px;
            background: #2a2a2e;
            border-radius: 2px 0 0 2px;
            box-shadow: 0 42px 0 #2a2a2e;
        }
        .wa-top-chrome { background: #000; flex-shrink: 0; padding-bottom: 4px; }
        .wa-dynamic-island {
            width: 88px; height: 26px;
            background: #000;
            border-radius: 20px;
            margin: 6px auto 4px;
            display: flex; align-items: center; justify-content: center; gap: 6px;
            box-shadow: 0 0 0 1px rgba(255,255,255,0.05);
        }
        .wa-di-camera {
            width: 8px; height: 8px;
            border-radius: 50%;
            background: radial-gradient(circle at 35% 35%, #1a3a6a, #0a0a1a);
            box-shadow: 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 3px rgba(100,160,255,0.3);
        }
        .wa-di-pill { width: 32px; height: 8px; border-radius: 4px; background: #0a0a0d; }
        .wa-status-bar {
            display: flex; justify-content: space-between; align-items: center;
            padding: 0 14px 4px; flex-shrink: 0;
        }
        .wa-status-time { font-size: 10px; font-weight: 700; color: #fff; letter-spacing: 0.2px; }
        .wa-status-icons { display: flex; align-items: center; gap: 5px; color: #fff; font-size: 9px; }
        .wa-battery { display: flex; align-items: center; gap: 1px; }
        .wa-battery-body {
            width: 20px; height: 10px;
            border: 1.5px solid rgba(255,255,255,0.7);
            border-radius: 2.5px;
            position: relative; display: flex; align-items: center; padding: 1.5px;
        }
        .wa-battery-body::after {
            content: ''; position: absolute;
            right: -4px; top: 50%; transform: translateY(-50%);
            width: 2px; height: 5px;
            background: rgba(255,255,255,0.5);
            border-radius: 0 1px 1px 0;
        }
        .wa-battery-fill { height: 100%; width: 72%; background: #fff; border-radius: 1px; }
        .wa-screen {
            border-radius: 34px; overflow: hidden;
            display: flex; flex-direction: column;
            height: 460px; background: #000;
        }
        .wa-topbar {
            background: #075E54; padding: 8px 12px 9px;
            display: flex; align-items: center; gap: 9px; flex-shrink: 0;
        }
        .wa-back { color: rgba(255,255,255,0.9); font-size: 14px; line-height: 1; }
        .wa-avatar {
            width: 33px; height: 33px; border-radius: 50%;
            background: linear-gradient(135deg, #FC8900, #e07000);
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0; border: 1.5px solid rgba(255,255,255,0.2);
        }
        .wa-avatar img { width: 19px; height: 19px; object-fit: contain; }
        .wa-contact-info { flex: 1; min-width: 0; }
        .wa-contact-name { font-size: 13px; font-weight: 600; color: #fff; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .wa-contact-status { font-size: 10px; color: rgba(255,255,255,0.8); display: flex; align-items: center; gap: 3px; }
        .wa-contact-status::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: #25d366; display: inline-block; }
        .wa-topbar-actions { display: flex; gap: 18px; color: rgba(255,255,255,0.9); font-size: 14px; }

        .wa-transition-wrap { flex: 1; position: relative; overflow: hidden; min-height: 0; }
        .wa-transition-wrap > * { position: absolute; inset: 0; }
        .wa-body {
            position: absolute; inset: 0;
            opacity: 0; transition: opacity 0.6s ease; pointer-events: none;
            background-color: #e5ddd5;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none' stroke='%23c8bfb5' stroke-width='0.6' opacity='0.5'%3E%3Ccircle cx='15' cy='15' r='5'/%3E%3Ccircle cx='45' cy='45' r='5'/%3E%3Cpath d='M30 5 L35 15 L25 15Z'/%3E%3Cpath d='M30 55 L35 45 L25 45Z'/%3E%3C/g%3E%3C/svg%3E");
            background-size: 60px 60px;
        }
        .wa-body.visible { opacity: 1; pointer-events: auto; }
        .wa-date-chip { text-align: center; margin-bottom: 8px; }
        .wa-date-chip span {
            display: inline-block; background: rgba(225,245,254,0.92);
            color: #546e7a; font-size: 9.5px; padding: 3px 10px;
            border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.12);
        }
        .wa-messages {
            display: flex; flex-direction: column; gap: 3px;
            padding: 8px 10px 6px; height: 100%; overflow: hidden; justify-content: flex-end;
        }
        .wa-msg {
            max-width: 82%; padding: 6px 10px 3px; border-radius: 7.5px;
            font-size: 11.5px; line-height: 1.5; position: relative;
            word-break: break-word; white-space: pre-line;
            animation: waBubbleIn 0.2s ease-out both;
        }
        .wa-msg.left {
            background: #fff; color: #111b21;
            align-self: flex-start; border-top-left-radius: 0;
            box-shadow: 0 1px 1px rgba(0,0,0,0.13);
        }
        .wa-msg.left::before {
            content: ''; position: absolute; top: 0; left: -8px;
            width: 0; height: 0; border-style: solid;
            border-width: 0 9px 9px 0; border-color: transparent #fff transparent transparent;
        }
        .wa-msg.right {
            background: #dcf8c6; color: #111b21;
            align-self: flex-end; border-top-right-radius: 0;
            box-shadow: 0 1px 1px rgba(0,0,0,0.13);
        }
        .wa-msg.right::before {
            content: ''; position: absolute; top: 0; right: -8px;
            width: 0; height: 0; border-style: solid;
            border-width: 9px 9px 0 0; border-color: #dcf8c6 transparent transparent transparent;
        }
        .wa-msg-meta {
            display: flex; align-items: center; justify-content: flex-end;
            gap: 3px; margin-top: 1px; float: right; margin-left: 6px; margin-bottom: -1px;
        }
        .wa-msg-time { font-size: 9.5px; color: rgba(0,0,0,0.38); font-variant-numeric: tabular-nums; }
        .wa-msg-ticks { font-size: 11px; color: #53bdeb; line-height: 1; }
        .wa-typing {
            background: #fff; border-radius: 7.5px; border-top-left-radius: 0;
            align-self: flex-start; padding: 9px 14px 8px;
            box-shadow: 0 1px 1px rgba(0,0,0,0.13);
            animation: waBubbleIn 0.2s ease both; position: relative;
        }
        .wa-typing::before {
            content: ''; position: absolute; top: 0; left: -8px;
            width: 0; height: 0; border-style: solid;
            border-width: 0 9px 9px 0; border-color: transparent #fff transparent transparent;
        }
        .wa-typing-dots { display: flex; gap: 4px; align-items: center; }
        .wa-typing-dots span {
            width: 7px; height: 7px; border-radius: 50%;
            background: #adb5bd; animation: waDot 1.2s infinite ease-in-out;
        }
        .wa-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .wa-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        .wa-inputbar {
            background: #f0f0f0; padding: 6px 8px;
            display: flex; align-items: center; gap: 6px; flex-shrink: 0;
        }
        .wa-inputbar-field {
            flex: 1; background: #fff; border-radius: 22px;
            padding: 7px 12px; font-size: 11px; color: #aaa;
            display: flex; align-items: center; gap: 8px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.08);
        }
        .wa-inputbar-field span { flex: 1; }
        .wa-inputbar-emoji { font-size: 14px; }
        .wa-inputbar-attach { color: #8696a0; font-size: 16px; }
        .wa-inputbar-send {
            width: 36px; height: 36px; background: #075E54; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: #fff; font-size: 13px; flex-shrink: 0;
        }
        .wa-gif-screen {
            position: absolute; inset: 0;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            background: #e5ddd5; gap: 10px; padding: 16px;
            opacity: 1; transition: opacity 0.6s ease; z-index: 2; pointer-events: auto;
        }
        .wa-gif-screen.fading { opacity: 0; }
        .wa-gif-screen.hidden  { opacity: 0; pointer-events: none; }
        .wa-gif-screen img {
            width: 175px; height: 175px; object-fit: contain;
            display: block; margin: 0 auto 0 calc(50% - 87px + 12px);
        }
        .wa-gif-screen-label { font-size: 10.5px; color: rgba(0,0,0,0.35); letter-spacing: 0.5px; }
        .wa-gif-progress {
            width: 80%; height: 2px; background: rgba(0,0,0,0.1); border-radius: 2px; overflow: hidden;
        }
        .wa-gif-progress-bar { height: 100%; width: 0%; background: #075E54; border-radius: 2px; }
        .wa-gif-progress-bar.running { animation: gifProgress 14s linear forwards; }
        @keyframes gifProgress { from { width: 0%; } to { width: 100%; } }
        @keyframes waDot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-5px); opacity: 1; } }
        @keyframes waBubbleIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

        .cb-cards-col {}
        .cb-cards-header { margin-bottom: 16px; }
        .cb-cards-label { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #128AA2; opacity: 0.55; }
        .cb-cards-grid {
            display: grid; grid-template-columns: 1fr 1fr; gap: 18px;
        }
        .cb-card {
            background: #fff; border: 1px solid #eaeef2; border-radius: 20px;
            padding: 26px 22px 22px;
            transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
            position: relative; overflow: hidden;
        }
        .cb-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 16px 44px rgba(18,138,162,0.11);
            border-color: var(--card-color, #128AA2);
        }
        .cb-card-line {
            position: absolute; bottom: 0; left: 0; right: 0;
            height: 3px; border-radius: 0 0 20px 20px;
            transform: scaleX(0); transform-origin: left;
            transition: transform 0.35s ease;
        }
        .cb-card:hover .cb-card-line { transform: scaleX(1); }
        .cb-card-top {
            display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
        }
        .cb-card-icon {
            width: 52px; height: 52px; border-radius: 14px;
            display: flex; align-items: center; justify-content: center;
            font-size: 21px; transition: transform 0.3s ease, background 0.3s ease;
        }
        .cb-card:hover .cb-card-icon { transform: scale(1.1); color: #fff !important; background: var(--card-color) !important; }
        .cb-card-num { font-size: 28px; font-weight: 800; line-height: 1; letter-spacing: -1px; }
        .cb-card-title { font-size: 15px; font-weight: 700; color: #060404; margin-bottom: 8px; line-height: 1.35; }
        .cb-card-desc {
            font-size: 12.5px; color: #5A5454; line-height: 1.7;
            display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3;
            -webkit-box-orient: vertical; overflow: hidden; margin: 0;
        }

        .cb-faq-strip {
            background: #fff;
            padding: 56px 0 64px;
        }
        .cb-faq-inner {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px 60px;
        }
        .cb-faq-left {}
        .cb-faq-eyebrow {
            font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
            text-transform: uppercase; color: #FC8900; margin-bottom: 12px;
        }
        .cb-faq-title { font-size: clamp(20px, 2.5vw, 30px); font-weight: 800; color: #060404; line-height: 1.3; margin-bottom: 14px; }
        .cb-faq-subtitle { font-size: 14px; color: #5A5454; line-height: 1.75; margin-bottom: 28px; }
        .cb-wa-cta {
            display: inline-flex; align-items: center; gap: 10px;
            background: #25d366; color: #fff;
            font-size: 13px; font-weight: 700;
            padding: 13px 26px; border-radius: 30px; text-decoration: none;
            transition: background 0.2s, transform 0.2s;
            box-shadow: 0 4px 16px rgba(37,211,102,0.30);
        }
        .cb-wa-cta:hover { background: #1db954; color: #fff; transform: translateY(-2px); }
        .cb-faq-right {}
        .cb-faq-list { display: flex; flex-direction: column; gap: 12px; }
        .cb-faq-item {
            background: #f4f7f9; border-radius: 16px; padding: 20px 24px;
            border: 1px solid #eaeef2;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .cb-faq-item:hover { border-color: #128AA2; box-shadow: 0 4px 16px rgba(18,138,162,0.07); }
        .cb-faq-q {
            font-size: 14px; font-weight: 700; color: #060404; margin-bottom: 6px;
            display: flex; align-items: flex-start; gap: 10px;
        }
        .cb-faq-q i { color: #128AA2; font-size: 13px; margin-top: 2px; flex-shrink: 0; }
        .cb-faq-a { font-size: 13px; color: #5A5454; line-height: 1.65; margin: 0; padding-left: 23px; }

        @media (max-width: 1100px) {
            .cb-layout { grid-template-columns: 1fr 1fr; }
            .cb-text-col { grid-column: 1 / -1; }
        }
        @media (max-width: 768px) {
            .cb-layout { grid-template-columns: 1fr; }
            .cb-hero-inner { flex-direction: column; }
            .cb-hero-deco { display: none; }
            .cb-faq-inner { grid-template-columns: 1fr; }
        }
        @media (max-width: 575px) {
            .cb-cards-grid { grid-template-columns: 1fr; }
            .wa-phone-wrap { max-width: 260px; }
            .wa-float-badge--top { right: -10px; }
            .wa-float-badge--bot { left: -10px; }
            .cb-hero-body { padding: 90px 0 48px; }
        }
    `]
})
export class ChatbotComponent implements OnInit, OnDestroy {
    private cdr = inject(ChangeDetectorRef);

    readonly cards = CARDS;

    showGif   = true;
    gifFading = false;
    visibleMsgs: ChatMsg[] = [];
    showTyping = false;

    private step = 0;
    private timers: ReturnType<typeof setTimeout>[] = [];

    readonly GIF_MS = 14000;

    ngOnInit(): void {
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

    ngOnDestroy(): void {
        this.timers.forEach(t => clearTimeout(t));
    }

    private after(ms: number, fn: () => void): void {
        this.timers.push(setTimeout(fn, ms));
    }

    private scheduleNext(): void {
        if (this.step >= MESSAGES.length) {
            this.after(3500, () => {
                this.visibleMsgs = [];
                this.step = 0;
                this.showGif = true;
                this.gifFading = false;
                this.cdr.markForCheck();
                this.after(this.GIF_MS, () => {
                    this.gifFading = true;
                    this.cdr.markForCheck();
                    this.after(600, () => {
                        this.showGif = false;
                        this.cdr.markForCheck();
                        this.scheduleNext();
                    });
                });
            });
            return;
        }

        const msg = MESSAGES[this.step];

        if (!msg.right) {
            this.after(600, () => {
                this.showTyping = true;
                this.cdr.markForCheck();
                this.after(900, () => {
                    this.showTyping = false;
                    this.visibleMsgs = [...this.visibleMsgs, msg];
                    this.step++;
                    this.cdr.markForCheck();
                    this.scheduleNext();
                });
            });
        } else {
            this.after(1200, () => {
                this.visibleMsgs = [...this.visibleMsgs, msg];
                this.step++;
                this.cdr.markForCheck();
                this.scheduleNext();
            });
        }
    }
}
