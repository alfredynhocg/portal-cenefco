import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { CursoPasadoService } from '../../cursos-pasados/application/services/curso-pasado.service';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';
import { CursoPasado } from '../../cursos-pasados/domain/models/curso-pasado.model';

interface ChatMsg { text: string; right: boolean; time: string; }

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const mesInicio = MESES[(new Date().getMonth() + 2) % 12];

const MESSAGES: ChatMsg[] = [
    { right: false, time: '09:41', text: '👋 ¡Hola! Bienvenido/a al historial de cursos del CENEFCO.\n¿Buscás algún programa específico?' },
    { right: true,  time: '09:42', text: 'Sí, quiero saber si cursé Gestión Pública 🎓' },
    { right: false, time: '09:42', text: '¡Por supuesto! Podés buscar tu curso por nombre en el buscador de la izquierda. ✅' },
    { right: true,  time: '09:43', text: '¿Puedo ver la lista de participantes?' },
    { right: false, time: '09:43', text: `📋 Sí. Ingresá al detalle del curso y encontrarás el listado completo de estudiantes registrados. ¡El próximo inicio es en ${mesInicio}!` },
];

@Component({
    selector: 'app-cursos-pasados-list',
    imports: [BreadcrumbComponent, CommonModule, RouterLink, ImageUrlPipe],
    templateUrl: './cursos-pasados-list.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
        .cp-hero {
            position: relative; min-height: 280px;
            display: flex; align-items: flex-end;
            overflow: hidden; background: #128AA2;
        }
        .cp-hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.22; }
        .cp-hero-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(18,138,162,0.50) 0%, rgba(18,138,162,0.92) 100%); }
        .cp-hero-body { position: relative; z-index: 1; padding: 48px 0 36px; width: 100%; text-align: center; }
        .cp-hero-badge {
            display: inline-flex; align-items: center; gap: 7px;
            background: rgba(255,255,255,0.12); color: #fff;
            font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
            padding: 5px 16px; border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.22); margin-bottom: 14px;
        }
        .cp-hero-badge i { color: #FC8900; }
        .cp-hero-title { font-size: clamp(28px, 4vw, 44px); font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 16px; }
        .cp-hero-title span { color: #FC8900; }

        .cp-section { background: #f4f7f9; padding: 48px 0 80px; }
        .cp-layout { display: grid; grid-template-columns: 1fr 280px; gap: 40px; align-items: start; }

        .cp-search-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
        .cp-search-wrap { position: relative; flex: 1; max-width: 380px; }
        .cp-search-wrap i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #128AA2; opacity: 0.45; font-size: 13px; }
        .cp-search-input {
            width: 100%; padding: 10px 14px 10px 38px;
            border: 1.5px solid rgba(18,138,162,0.16); border-radius: 10px;
            background: #fff; font-size: 13.5px; color: #333;
            outline: none; transition: border-color .2s;
        }
        .cp-search-input:focus { border-color: #128AA2; }

        .cp-card {
            background: #fff; border-radius: 16px; overflow: hidden;
            border: 1px solid rgba(18,138,162,0.07);
            box-shadow: 0 4px 20px rgba(18,138,162,0.07);
            display: flex; flex-direction: column; height: 100%;
            transition: transform .3s ease, box-shadow .3s ease;
            text-decoration: none;
        }
        .cp-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(18,138,162,0.13); }
        .cp-card-img { position: relative; height: 180px; overflow: hidden; flex-shrink: 0; }
        .cp-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
        .cp-card:hover .cp-card-img img { transform: scale(1.06); }
        .cp-card-img-placeholder {
            width: 100%; height: 100%;
            background: linear-gradient(135deg, #128AA2 0%, #0a5570 100%);
            display: flex; align-items: center; justify-content: center;
        }
        .cp-card-img-placeholder i { font-size: 40px; color: rgba(255,255,255,0.18); }
        .cp-card-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(18,138,162,0.55) 100%); pointer-events: none; }
        .cp-card-tag {
            position: absolute; top: 12px; left: 12px;
            background: #FC8900; color: #fff; font-size: 9.5px; font-weight: 700;
            padding: 3px 10px; border-radius: 20px; text-transform: uppercase;
            letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(252,137,0,0.35);
            display: flex; align-items: center; gap: 4px;
        }
        .cp-card-hours {
            position: absolute; bottom: 10px; right: 10px;
            background: rgba(255,255,255,0.15); backdrop-filter: blur(6px);
            color: #fff; font-size: 10.5px; font-weight: 600;
            padding: 3px 9px; border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.25);
            display: flex; align-items: center; gap: 4px;
        }
        .cp-card-hours i { color: #FC8900; font-size: 9px; }
        .cp-card-body { padding: 16px 18px 18px; display: flex; flex-direction: column; flex: 1; }
        .cp-card-title {
            font-size: 14px; font-weight: 700; color: #128AA2;
            line-height: 1.4; margin-bottom: 8px;
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .cp-card-meta-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
        .cp-meta-chip { display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 600; padding: 3px 9px; border-radius: 20px; }
        .cp-meta-chip--periodo { background: rgba(18,138,162,0.08); color: #128AA2; }
        .cp-meta-chip--part    { background: rgba(37,211,102,0.10); color: #1a9e5a; }
        .cp-card-footer { margin-top: auto; padding-top: 12px; border-top: 1px solid rgba(18,138,162,0.07); display: flex; justify-content: flex-end; }
        .cp-card-btn {
            display: inline-flex; align-items: center; gap: 5px;
            font-size: 12px; font-weight: 700; color: #128AA2;
            border: 1.5px solid rgba(18,138,162,0.22); border-radius: 8px;
            padding: 6px 13px; text-decoration: none; transition: all .25s ease;
        }
        .cp-card-btn:hover { background: #128AA2; border-color: #128AA2; color: #fff; }

        .cp-skeleton { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(18,138,162,0.07); }
        .cp-skel-img { height: 180px; background: #eef0f2; animation: cp-pulse 1.4s ease-in-out infinite; }
        .cp-skel-body { padding: 16px 18px; }
        .cp-skel-line { height: 12px; border-radius: 6px; background: #eef0f2; margin-bottom: 10px; animation: cp-pulse 1.4s ease-in-out infinite; }
        .cp-skel-line.short { width: 55%; }
        .cp-skel-line.xs { width: 38%; margin-top: 8px; }
        @keyframes cp-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }

        .cp-empty { text-align: center; padding: 60px 24px; color: #bbb; }
        .cp-empty i { font-size: 48px; margin-bottom: 16px; display: block; color: #dde4e8; }
        .cp-empty p { font-size: 15px; margin: 0; }

        .cp-pagination-wrap { margin-top: 40px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .cp-pagination-info {
            display: flex; align-items: center; gap: 8px;
            font-size: 12.5px; color: #8a9aaa; font-weight: 500;
        }
        .cp-pagination-info strong { color: #128AA2; font-weight: 700; }
        .cp-pagination-info .cp-pag-sep { width: 4px; height: 4px; border-radius: 50%; background: #c8d4dc; }

        .cp-pagination { display: flex; align-items: center; gap: 4px; }
        .cp-page-btn {
            display: inline-flex; align-items: center; justify-content: center;
            min-width: 36px; height: 36px; padding: 0 6px; border-radius: 10px;
            border: 1.5px solid rgba(18,138,162,0.14); background: #fff;
            color: #128AA2; font-size: 13px; font-weight: 600;
            cursor: pointer; transition: all .18s ease;
            box-shadow: 0 1px 3px rgba(18,138,162,0.06);
        }
        .cp-page-btn:hover:not(:disabled):not(.active) {
            border-color: #128AA2; background: rgba(18,138,162,0.06);
            transform: translateY(-1px); box-shadow: 0 3px 8px rgba(18,138,162,0.12);
        }
        .cp-page-btn.active {
            background: #128AA2; border-color: #128AA2; color: #fff;
            box-shadow: 0 4px 12px rgba(18,138,162,0.30);
            transform: translateY(-1px);
        }
        .cp-page-btn:disabled { opacity: 0.28; cursor: not-allowed; box-shadow: none; }
        .cp-page-btn.cp-page-arrow { font-size: 11px; }
        .cp-page-dots {
            display: inline-flex; align-items: center; justify-content: center;
            min-width: 36px; height: 36px; font-size: 13px; color: #aab; letter-spacing: 1px;
            cursor: default; user-select: none;
        }

        .cp-sidebar { position: sticky; top: 24px; }
        .cp-sidebar-label {
            font-size: 10.5px; font-weight: 700; letter-spacing: 1.2px;
            text-transform: uppercase; color: #128AA2; opacity: 0.50;
            margin-bottom: 14px; text-align: center;
        }

        .wa-phone-wrap { position: relative; max-width: 240px; width: 100%; margin: 0 auto; }
        .wa-float-badge {
            position: absolute; display: flex; align-items: center; gap: 6px;
            font-size: 10px; font-weight: 600; padding: 5px 12px;
            border-radius: 20px; white-space: nowrap; z-index: 10;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .wa-float-badge--top { top: 24px; right: -20px; background: #fff; color: #128AA2; border: 1px solid #eaeef2; }
        .wa-float-badge--bot { bottom: 24px; left: -20px; background: #25d366; color: #fff; }
        .wa-float-badge i { font-size: 11px; }

        .wa-phone {
            width: 100%; border-radius: 44px;
            background: linear-gradient(145deg, #2a2a2e 0%, #1a1a1d 40%, #111113 70%, #0d0d0f 100%);
            padding: 7px 7px 14px; position: relative;
            box-shadow: -3px 0 8px rgba(255,255,255,0.04), 0 0 0 1px rgba(255,255,255,0.08),
                        0 1px 0 rgba(255,255,255,0.12) inset, 0 40px 80px rgba(0,0,0,0.55);
        }
        .wa-phone::after { content: ''; position: absolute; right: -2px; top: 100px; width: 2px; height: 44px; background: #2a2a2e; border-radius: 0 2px 2px 0; }
        .wa-phone-vol { position: absolute; left: -2px; top: 88px; width: 2px; height: 28px; background: #2a2a2e; border-radius: 2px 0 0 2px; box-shadow: 0 38px 0 #2a2a2e; }

        .wa-top-chrome { background: #000; flex-shrink: 0; padding-bottom: 3px; }
        .wa-dynamic-island { width: 76px; height: 22px; background: #000; border-radius: 18px; margin: 5px auto 3px; display: flex; align-items: center; justify-content: center; gap: 5px; }
        .wa-di-camera { width: 7px; height: 7px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #1a3a6a, #0a0a1a); }
        .wa-di-pill { width: 28px; height: 7px; border-radius: 4px; background: #0a0a0d; }
        .wa-status-bar { display: flex; justify-content: space-between; align-items: center; padding: 0 12px 3px; flex-shrink: 0; }
        .wa-status-time { font-size: 9px; font-weight: 700; color: #fff; }
        .wa-status-icons { display: flex; align-items: center; gap: 4px; color: #fff; font-size: 8px; }
        .wa-battery-body { width: 17px; height: 8px; border: 1.5px solid rgba(255,255,255,0.7); border-radius: 2px; position: relative; display: flex; align-items: center; padding: 1px; }
        .wa-battery-body::after { content: ''; position: absolute; right: -3px; top: 50%; transform: translateY(-50%); width: 2px; height: 4px; background: rgba(255,255,255,0.5); border-radius: 0 1px 1px 0; }
        .wa-battery-fill { height: 100%; width: 72%; background: #fff; border-radius: 1px; }

        .wa-screen { border-radius: 30px; overflow: hidden; display: flex; flex-direction: column; height: 400px; background: #000; }
        .wa-topbar { background: #075E54; padding: 7px 10px 8px; display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .wa-back { color: rgba(255,255,255,0.9); font-size: 12px; }
        .wa-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #FC8900, #e07000); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid rgba(255,255,255,0.2); }
        .wa-avatar img { width: 16px; height: 16px; object-fit: contain; }
        .wa-contact-info { flex: 1; min-width: 0; }
        .wa-contact-name { font-size: 11.5px; font-weight: 600; color: #fff; line-height: 1.2; }
        .wa-contact-status { font-size: 9px; color: rgba(255,255,255,0.8); display: flex; align-items: center; gap: 3px; }
        .wa-contact-status::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: #25d366; display: inline-block; }
        .wa-topbar-actions { display: flex; gap: 14px; color: rgba(255,255,255,0.9); font-size: 12px; }

        .wa-transition-wrap { flex: 1; position: relative; overflow: hidden; min-height: 0; }
        .wa-transition-wrap > * { position: absolute; inset: 0; }
        .wa-body {
            position: absolute; inset: 0; opacity: 0; transition: opacity 0.6s ease; pointer-events: none;
            background-color: #e5ddd5;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none' stroke='%23c8bfb5' stroke-width='0.6' opacity='0.5'%3E%3Ccircle cx='15' cy='15' r='5'/%3E%3Ccircle cx='45' cy='45' r='5'/%3E%3C/g%3E%3C/svg%3E");
            background-size: 60px 60px;
        }
        .wa-body.visible { opacity: 1; pointer-events: auto; }
        .wa-date-chip { text-align: center; margin-bottom: 6px; }
        .wa-date-chip span { display: inline-block; background: rgba(225,245,254,0.92); color: #546e7a; font-size: 8.5px; padding: 2px 9px; border-radius: 7px; }
        .wa-messages { display: flex; flex-direction: column; gap: 3px; padding: 7px 9px 5px; height: 100%; overflow: hidden; justify-content: flex-end; }
        .wa-msg {
            max-width: 84%; padding: 5px 9px 3px; border-radius: 7px;
            font-size: 10.5px; line-height: 1.5; position: relative;
            word-break: break-word; white-space: pre-line;
            animation: waBubbleIn 0.2s ease-out both;
        }
        .wa-msg.left { background: #fff; color: #111b21; align-self: flex-start; border-top-left-radius: 0; box-shadow: 0 1px 1px rgba(0,0,0,0.13); }
        .wa-msg.left::before { content: ''; position: absolute; top: 0; left: -7px; width: 0; height: 0; border-style: solid; border-width: 0 8px 8px 0; border-color: transparent #fff transparent transparent; }
        .wa-msg.right { background: #dcf8c6; color: #111b21; align-self: flex-end; border-top-right-radius: 0; box-shadow: 0 1px 1px rgba(0,0,0,0.13); }
        .wa-msg.right::before { content: ''; position: absolute; top: 0; right: -7px; width: 0; height: 0; border-style: solid; border-width: 8px 8px 0 0; border-color: #dcf8c6 transparent transparent transparent; }
        .wa-msg-meta { display: flex; align-items: center; justify-content: flex-end; gap: 3px; margin-top: 1px; float: right; margin-left: 5px; margin-bottom: -1px; }
        .wa-msg-time { font-size: 8.5px; color: rgba(0,0,0,0.38); }
        .wa-msg-ticks { font-size: 10px; color: #53bdeb; }
        .wa-typing { background: #fff; border-radius: 7px; border-top-left-radius: 0; align-self: flex-start; padding: 8px 12px 7px; box-shadow: 0 1px 1px rgba(0,0,0,0.13); animation: waBubbleIn 0.2s ease both; position: relative; }
        .wa-typing::before { content: ''; position: absolute; top: 0; left: -7px; width: 0; height: 0; border-style: solid; border-width: 0 8px 8px 0; border-color: transparent #fff transparent transparent; }
        .wa-typing-dots { display: flex; gap: 3px; align-items: center; }
        .wa-typing-dots span { width: 6px; height: 6px; border-radius: 50%; background: #adb5bd; animation: waDot 1.2s infinite ease-in-out; }
        .wa-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .wa-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        .wa-inputbar { background: #f0f0f0; padding: 5px 7px; display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
        .wa-inputbar-field { flex: 1; background: #fff; border-radius: 20px; padding: 6px 10px; font-size: 10px; color: #aaa; display: flex; align-items: center; gap: 6px; }
        .wa-inputbar-field span { flex: 1; }
        .wa-inputbar-emoji { font-size: 12px; }
        .wa-inputbar-send { width: 30px; height: 30px; background: #075E54; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; flex-shrink: 0; }

        .wa-gif-screen {
            position: absolute; inset: 0; display: flex; flex-direction: column;
            align-items: center; justify-content: center; background: #e5ddd5;
            gap: 8px; padding: 14px; opacity: 1; transition: opacity 0.6s ease; z-index: 2;
        }
        .wa-gif-screen.fading { opacity: 0; }
        .wa-gif-screen.hidden  { opacity: 0; pointer-events: none; }
        .wa-gif-screen img { width: 140px; height: 140px; object-fit: contain; display: block; margin: 0 auto 0 calc(50% - 70px + 10px); }
        .wa-gif-screen-label { font-size: 9.5px; color: rgba(0,0,0,0.35); letter-spacing: 0.4px; }
        .wa-gif-progress { width: 78%; height: 2px; background: rgba(0,0,0,0.1); border-radius: 2px; overflow: hidden; }
        .wa-gif-progress-bar { height: 100%; width: 0%; background: #075E54; border-radius: 2px; }
        .wa-gif-progress-bar.running { animation: gifProgress 14s linear forwards; }

        @keyframes gifProgress { from { width: 0%; } to { width: 100%; } }
        @keyframes waDot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }
        @keyframes waBubbleIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 1024px) {
            .cp-layout { grid-template-columns: 1fr; }
            .cp-sidebar { display: none; }
        }
        @media (max-width: 767px) {
            .cp-card-img { height: 160px; }
            .cp-hero-body { padding: 32px 0 24px; }
        }
    `]
})
export class CursosPasadosListComponent implements OnInit, OnDestroy {
    private service   = inject(CursoPasadoService);
    private cdr       = inject(ChangeDetectorRef);
    private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    cursos: CursoPasado[] = [];
    cargando  = true;
    pageIndex = 1;
    pageSize  = 12;
    total     = 0;
    query     = '';

    get totalPages(): number { return Math.ceil(this.total / this.pageSize); }
    get pages(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

    get pageItems(): (number | -1)[] {
        const total = this.totalPages;
        const cur   = this.pageIndex;
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        const items: (number | -1)[] = [1];
        if (cur > 3)          items.push(-1);
        const start = Math.max(2, cur - 1);
        const end   = Math.min(total - 1, cur + 1);
        for (let i = start; i <= end; i++) items.push(i);
        if (cur < total - 2) items.push(-1);
        items.push(total);
        return items;
    }

    get fromResult(): number { return this.total === 0 ? 0 : (this.pageIndex - 1) * this.pageSize + 1; }
    get toResult():   number { return Math.min(this.pageIndex * this.pageSize, this.total); }

    showGif   = true;
    gifFading = false;
    visibleMsgs: ChatMsg[] = [];
    showTyping = false;
    private step = 0;
    private timers: ReturnType<typeof setTimeout>[] = [];
    private searchTimer: ReturnType<typeof setTimeout> | null = null;
    readonly GIF_MS = 14000;

    ngOnInit(): void {
        this.cargar();
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

    ngOnDestroy(): void { this.timers.forEach(t => clearTimeout(t)); }

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

    cargar(): void {
        this.cargando = true;
        this.cdr.detectChanges();
        this.service.getAll(this.pageIndex, this.pageSize, this.query).subscribe({
            next: (res) => {
                this.cursos    = res.data;
                this.total     = res.total;
                this.cargando  = false;
                this.cdr.detectChanges();
                if (this.isBrowser) window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            error: () => {
                this.cursos   = [];
                this.cargando = false;
                this.cdr.detectChanges();
            }
        });
    }

    onSearch(e: Event): void {
        this.query = (e.target as HTMLInputElement).value.trim();
        this.pageIndex = 1;
        if (this.searchTimer) clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => this.cargar(), 350);
    }

    goToPage(page: number): void {
        if (page < 1 || page > this.totalPages || page === this.pageIndex) return;
        this.pageIndex = page;
        this.cargar();
    }

}
