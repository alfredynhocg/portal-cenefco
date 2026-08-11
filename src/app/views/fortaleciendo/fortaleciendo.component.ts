import { Component, OnInit, OnDestroy, PLATFORM_ID, signal, ChangeDetectorRef, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fortaleciendo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './fortaleciendo.component.html',
  styles: [`
    .ft {
      background:
        linear-gradient(rgba(18, 138, 162, 0.88), rgba(18, 138, 162, 0.88)),
        url('/assets/img/web/fondo_cenefco.webp') center center / cover no-repeat;
      padding: 72px 40px 60px;
      overflow: hidden;
      font-family: var(--ztc-family-ff-heading, 'Figtree', sans-serif);
    }

    /* todas las imágenes: ancho 100%, altura automática = sin recorte */
    .ft-img-certs,
    .ft-img-grupal,
    .ft-slide {
      position: relative;
      border-radius: 10px;
      overflow: hidden;
    }
    .ft-img-certs img,
    .ft-img-grupal img,
    .ft-slide img {
      display: block;
      width: 48%;
      height: auto;
      margin: 0 auto;
    }
    .ft-img-placeholder {
      display: none;
      flex-direction: column; align-items: center; justify-content: center;
      gap: 8px; color: rgba(255,255,255,0.45);
      font-size: 12px; font-weight: 600; text-align: center;
      padding: 40px 20px; min-height: 120px;
      background: rgba(255,255,255,0.07);
      border: 2px dashed rgba(255,255,255,0.2);
      border-radius: 10px;
    }
    .ft-img-placeholder i { font-size: 32px; }
    .ft-img--empty .ft-img-placeholder { display: flex; }
    .ft-img--empty img { display: none; }

    /* ══ ZONA SUPERIOR ══ */
    .ft-top {
      display: grid;
      grid-template-columns: 55% 45%;
      gap: 20px;
      align-items: start;
      margin-bottom: 16px;
    }

    .ft-col-izq { display: flex; flex-direction: column; gap: 8px; }

    .ft-con-brand {
      display: flex; align-items: baseline; gap: 10px; margin: 0;
    }
    .ft-con {
      font-size: clamp(14px, 1.6vw, 22px); font-weight: 800;
      color: #fff; letter-spacing: 4px;
    }
    .ft-brand {
      font-size: clamp(14px, 1.6vw, 22px); font-weight: 900;
      letter-spacing: 7px; color: rgba(200,240,255,0.82);
    }

    .ft-no-row {
      display: flex; align-items: center; gap: 8px; margin: 0;
    }
    .ft-no {
      font-size: clamp(56px, 12vw, 155px); font-weight: 900;
      color: #fff; line-height: 0.85; letter-spacing: -5px; flex-shrink: 0;
    }
    .ft-no-side {
      display: flex; flex-direction: column; gap: 2px;
    }
    .ft-solo {
      font-size: clamp(12px, 1.5vw, 20px); font-weight: 700;
      color: rgba(255,255,255,0.9); letter-spacing: 1px; line-height: 1;
    }
    .ft-certif {
      font-size: clamp(18px, 3vw, 38px); font-weight: 900;
      color: #FC8900; letter-spacing: 1px; line-height: 1;
      text-decoration: underline;
      text-decoration-color: rgba(252,137,0,0.4);
      text-decoration-thickness: 3px;
      text-underline-offset: 5px;
    }

    /* imagen certificados sin altura fija */
    .ft-img-certs { margin: 0; }

    .ft-descuentos { margin: 0; }
    .ft-obt {
      font-size: clamp(12px, 1.4vw, 18px); font-weight: 700;
      color: rgba(255,255,255,0.85); margin: 0; letter-spacing: 1px; line-height: 1;
    }
    .ft-desc {
      font-size: clamp(24px, 4vw, 50px); font-weight: 900;
      color: #fff; margin: 0; line-height: 1;
    }

    .ft-col-der { display: flex; flex-direction: column; gap: 10px; }

    /* imagen grupal sin altura fija */
    .ft-img-grupal { margin: 0; }

    .ft-beneficios { text-align: right; }
    .ft-tienes {
      font-size: clamp(11px, 1.2vw, 16px); font-weight: 700;
      color: rgba(255,255,255,0.82); margin: 0; letter-spacing: 1px; line-height: 1;
    }
    .ft-ben {
      font-size: clamp(28px, 4.5vw, 58px); font-weight: 900;
      color: #fff; margin: 0; letter-spacing: -1px; line-height: 1;
    }

    /* ══ GHOST CONVENIOS ══ */
    .ft-convenios-ghost {
      text-align: right;
      font-size: clamp(20px, 3.5vw, 48px); font-weight: 900;
      color: rgba(255,255,255,0.14); letter-spacing: 6px;
      margin: 8px 0 12px;
      user-select: none;
    }

    /* ══ ZONA CONVENIOS / SLIDER ══ */
    .ft-mid {
      display: grid;
      grid-template-columns: 55% 45%;
      gap: 20px;
      align-items: center;
      margin-bottom: 32px;
    }

    .ft-mid-izq {
      position: relative;
      padding-left: 40px;
    }

    .ft-conv-vert {
      position: absolute; left: 0; top: 50%;
      transform: translateY(-50%) rotate(180deg);
      writing-mode: vertical-rl;
      font-size: 11px; font-weight: 900;
      color: rgba(255,255,255,0.55); letter-spacing: 7px;
      user-select: none; pointer-events: none;
    }

    /* SLIDER */
    .ft-slider {
      position: relative;
      border-radius: 10px;
      overflow: hidden;
    }
    .ft-slider-track {
      display: flex;
      transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
    }
    .ft-slide {
      flex: 0 0 100%; width: 100%;
      border-radius: 0;
    }
    /* imagen slider vertical — sin altura fija, se ve completa */
    .ft-slide img {
      display: block; width: 40%; height: auto; margin: 0 auto;
    }

    .ft-conv-tag {
      position: absolute; left: 0; right: 0; bottom: 0;
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
      background: rgba(0,0,0,0.68); padding: 10px 14px; z-index: 2;
    }
    .ft-conv-tag span {
      font-size: 10px; font-weight: 800; color: #fff;
      letter-spacing: .5px; line-height: 1.4; text-transform: uppercase;
    }
    .ft-conv-tag i { color: #FC8900; font-size: 18px; flex-shrink: 0; }

    .ft-slider-dots {
      display: flex; gap: 6px;
      justify-content: center;
      padding: 8px 0 4px;
    }
    .ft-sdot {
      width: 7px; height: 7px; border-radius: 50%;
      background: rgba(255,255,255,0.35);
      transition: background 0.3s, transform 0.3s;
    }
    .ft-sdot--on { background: #FC8900; transform: scale(1.3); }

    .ft-mid-der {
      display: flex; flex-direction: column; justify-content: center; gap: 4px;
    }
    .ft-aliados-pre {
      font-size: clamp(16px, 2.5vw, 32px); font-weight: 900;
      color: #fff; margin: 0; line-height: 1.1;
    }
    .ft-aliados {
      font-size: clamp(38px, 6.5vw, 84px); font-weight: 900;
      margin: 0; line-height: 1;
      color: #FC8900;
      -webkit-text-stroke: 1px #ffb347;
      text-shadow:
        0 0 2px  #fff,
        0 0 10px #FC8900,
        0 0 20px #FC8900,
        0 0 42px rgba(252,137,0,0.6),
        0 0 82px rgba(252,137,0,0.25);
    }

    /* ══ BIRRETES ══ */
    .ft-birretes {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding: 28px 0 8px;
      flex-wrap: wrap;
    }
    .ft-birretes img {
      width: 90px; height: 90px;
      object-fit: contain;
      background: rgba(255,255,255,0.92);
      border-radius: 50%;
      padding: 16px;
    }

    /* ══ ZONA CURSOS ══ */
    .ft-bottom {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      align-items: center;
      padding-top: 8px;
    }
    .ft-bottom-izq { display: flex; flex-direction: column; align-items: flex-start; gap: 0; }
    .ft-bottom-der {
      display: flex; align-items: center; justify-content: center;
    }
    .ft-logos-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px 16px;
      align-items: center;
      justify-items: center;
      width: 100%;
    }
    .ft-logos-grid img {
      width: 100%; max-width: 180px; height: auto;
      object-fit: contain;
      mix-blend-mode: screen;
      opacity: 0.9;
      transition: opacity 0.2s;
    }
    .ft-logos-grid img:hover { opacity: 1; }
    .ft-logos-grid img:last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }
    .ft-plus {
      font-size: clamp(15px, 2vw, 26px); font-weight: 700;
      color: #fff; margin: 0; letter-spacing: 1px; line-height: 1.3;
    }
    .ft-plus-sym { color: #FC8900; font-style: italic; }
    .ft-especializados {
      font-size: clamp(34px, 6.5vw, 84px); font-weight: 900;
      color: #fff; margin: 0; line-height: 1; letter-spacing: -2px;
    }
    .ft-con2 {
      font-size: clamp(18px, 3vw, 38px); font-weight: 700;
      color: rgba(255,255,255,0.82); margin: 0; line-height: 1.1; letter-spacing: 2px;
    }
    .ft-certificacion {
      font-size: clamp(34px, 6.5vw, 84px); font-weight: 900;
      color: #FC8900; margin: 0 0 32px; line-height: 1; letter-spacing: -2px;
      -webkit-text-stroke: 1px #ffb347;
      text-shadow:
        0 0 2px  #fff,
        0 0 10px #FC8900,
        0 0 20px #FC8900,
        0 0 42px rgba(252,137,0,0.6),
        0 0 82px rgba(252,137,0,0.25);
    }
    .ft-btn-wrap { width: 100%; display: flex; justify-content: center; }
    .ft-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 10px;
      background: transparent;
      color: #fff;
      padding: 12px 24px;
      border: 2px solid rgba(0, 230, 210, 0.8);
      border-radius: 6px;
      font-size: 14px; font-weight: 800;
      letter-spacing: 2px; text-decoration: none; text-transform: uppercase;
      box-shadow: 0 0 12px rgba(0,230,210,0.4), inset 0 0 12px rgba(0,230,210,0.08);
      transition: box-shadow .3s, transform .2s;
    }
    .ft-btn:hover {
      box-shadow: 0 0 24px rgba(0,230,210,0.7), inset 0 0 20px rgba(0,230,210,0.15);
      transform: translateY(-2px);
    }
    .ft-btn-icon {
      width: 36px; height: 36px; object-fit: contain;
      filter: drop-shadow(0 0 6px rgba(0,230,210,0.8));
    }

    /* ══ RESPONSIVE ══ */
    @media (max-width: 1100px) {
      .ft { padding: 72px 28px 52px; }
    }
    @media (max-width: 900px) {
      .ft { padding: 72px 20px 48px; }
      .ft-conv-vert { font-size: 10px; letter-spacing: 5px; }
      .ft-bottom { gap: 32px; }
    }
    @media (max-width: 767px) {
      .ft { padding: 64px 16px 44px; }
      .ft-top    { grid-template-columns: 1fr; }
      .ft-mid    { grid-template-columns: 1fr; }
      .ft-bottom { grid-template-columns: 1fr; }
      .ft-beneficios { text-align: left; }
      .ft-convenios-ghost { text-align: left; }
      .ft-mid-izq { padding-left: 28px; }
      /* imágenes un poco más grandes en móvil */
      .ft-img-certs img,
      .ft-img-grupal img { width: 80%; }
      .ft-slide img { width: 70%; }
      .ft-btn-wrap { justify-content: flex-start; }
    }
    @media (max-width: 600px) {
      .ft-no { font-size: clamp(50px, 14vw, 80px); letter-spacing: -4px; }
      .ft-certif { font-size: clamp(16px, 5vw, 28px); }
      .ft-top { grid-template-columns: 1fr; }
      .ft-mid  { grid-template-columns: 1fr; }
      .ft-bottom { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px) {
      .ft { padding: 60px 14px 40px; }
      .ft-no { font-size: clamp(44px, 13vw, 72px); letter-spacing: -3px; }
      .ft-no-row { gap: 6px; }
      .ft-solo { font-size: clamp(11px, 3.5vw, 16px); }
      .ft-certif { font-size: clamp(14px, 5vw, 26px); }
      .ft-con, .ft-brand { font-size: clamp(12px, 3.5vw, 18px); }
      .ft-desc { font-size: clamp(20px, 6vw, 36px); }
      .ft-obt { font-size: clamp(11px, 3vw, 16px); }
      .ft-especializados, .ft-certificacion { font-size: clamp(24px, 8vw, 48px); letter-spacing: -1px; }
      .ft-aliados { font-size: clamp(30px, 9vw, 52px); }
      .ft-aliados-pre { font-size: clamp(14px, 4vw, 22px); }
      .ft-mid-izq { padding-left: 0; }
      .ft-conv-vert { display: none; }
      .ft-img-certs img, .ft-img-grupal img { width: 90%; }
      .ft-slide img { width: 80%; }
      .ft-btn { width: 100%; padding: 13px 16px; font-size: 12px; }
      .ft-birretes { gap: 12px; }
      .ft-birretes img { width: 70px; height: 70px; }
      .ft-logos-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
    }
  `]
})
export class FortaleciendoComponent implements OnInit, OnDestroy {
  private cdr       = inject(ChangeDetectorRef);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  sliderImgs = [
    'assets/img/web/slider/img1.webp',
    'assets/img/web/slider/img2.webp',
    'assets/img/web/slider/img3.webp',
    'assets/img/web/slider/img4.webp',
    'assets/img/web/slider/img5.webp',
    'assets/img/web/slider/img6.webp',
  ];
  sliderIndex = signal(0);
  private _timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    if (!this.isBrowser) return;
    this._timer = setInterval(() => {
      this.sliderIndex.set((this.sliderIndex() + 1) % this.sliderImgs.length);
      this.cdr.detectChanges();
    }, 3500);
  }

  ngOnDestroy() {
    if (this._timer) clearInterval(this._timer);
  }
}
