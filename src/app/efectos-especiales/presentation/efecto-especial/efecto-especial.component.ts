import {
  Component, OnInit, OnDestroy, inject,
  ElementRef, ViewChild, AfterViewInit, PLATFORM_ID, NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EfectoEspecialService } from '../../application/services/efecto-especial.service';
import { EfectoEspecial } from '../../domain/models/efecto-especial.model';

interface Copo {
  x: number; y: number;
  vy: number;
  size: number; alpha: number;
  rot: number; vrot: number;
  wobble: number; wobbleSpeed: number;
  tipo: 'simple' | 'hex' | 'dendrita';
}

interface Particula {
  x: number; y: number;
  vx: number; vy: number;
  size: number; alpha: number;
  color: string; rot: number; vrot: number;
  shape: 'circle' | 'rect' | 'star' | 'leaf';
}

@Component({
  selector: 'app-efecto-especial',
  template: `<canvas #canvas style="
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    pointer-events:none;z-index:9998;
  "></canvas>`,
})
export class EfectoEspecialComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private service    = inject(EfectoEspecialService);
  private platformId = inject(PLATFORM_ID);
  private zone       = inject(NgZone);

  private ctx!:          CanvasRenderingContext2D;
  private rafId!:        number;
  private efecto:        EfectoEspecial | null = null;
  private running        = false;
  private copos:         Copo[]      = [];
  private particulas:    Particula[] = [];
  private vientoT        = 0;
  private resizeListener = () => this.resize();

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.service.getActivos().subscribe({
      next: (res) => { if (res.data.length) { this.efecto = res.data[0]; this.iniciar(); } },
      error: () => {},
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('resize', this.resizeListener);
  }

  private resize(): void {
    const c = this.canvasRef?.nativeElement;
    if (c) { c.width = window.innerWidth; c.height = window.innerHeight; }
  }

  private iniciar(): void {
    if (!this.efecto || !this.ctx || this.running) return;
    this.running = true;
    this.efecto.tipo_efecto === 'nieve' ? this.generarCopos() : this.generarParticulas();
    this.zone.runOutsideAngular(() => this.loop());
  }

  private generarCopos(): void {
    const cant = Math.floor((this.efecto!.intensidad / 100) * 70) + 15;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.copos = Array.from({ length: cant }, () => this.nuevoCopo(w, -(Math.random() * h)));
  }

  private nuevoCopo(w: number, y?: number): Copo {
    const grande = Math.random() > 0.6;
    const tipoR  = Math.random();
    return {
      x:           Math.random() * (w + 60) - 30,
      y:           y ?? -10,
      vy:          grande ? Math.random() * 0.8 + 0.6 : Math.random() * 0.5 + 0.3,
      size:        grande ? Math.random() * 7 + 5 : Math.random() * 4 + 2,
      alpha:       grande ? Math.random() * 0.35 + 0.55 : Math.random() * 0.25 + 0.2,
      rot:         Math.random() * Math.PI * 2,
      vrot:        (Math.random() - 0.5) * 0.006,
      wobble:      Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.006,
      tipo:        tipoR < 0.4 ? 'simple' : tipoR < 0.75 ? 'hex' : 'dendrita',
    };
  }

  private animarNieve(w: number, h: number): void {
    const ctx = this.ctx;
    this.vientoT += 0.004;
    const viento = Math.sin(this.vientoT) * 0.3;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle   = 'rgba(220,240,255,1)';
    ctx.strokeStyle = 'rgba(200,230,255,0.65)';

    for (const c of this.copos) {
      c.wobble += c.wobbleSpeed;
      c.x += Math.sin(c.wobble) * 0.55 + viento;
      c.y += c.vy;
      c.rot += c.vrot;

      if (c.y > h + c.size) Object.assign(c, this.nuevoCopo(w));
      if (c.x >  w + 30) c.x = -30;
      if (c.x < -30)     c.x =  w + 30;

      ctx.save();
      ctx.globalAlpha = c.alpha;
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.lineWidth = Math.max(0.5, c.size * 0.055);

      if      (c.tipo === 'simple')   this.copoSimple(ctx, c.size);
      else if (c.tipo === 'hex')      this.copoHex(ctx, c.size);
      else                            this.copoDendrita(ctx, c.size);

      ctx.restore();
    }
  }

  private copoSimple(ctx: CanvasRenderingContext2D, r: number): void {
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  private copoHex(ctx: CanvasRenderingContext2D, r: number): void {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const cx = Math.cos(a), cy = Math.sin(a);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(cx * r, cy * r);
      ctx.stroke();
      const mx = cx * r * 0.5, my = cy * r * 0.5;
      const ra = r * 0.28;
      for (const s of [-1, 1]) {
        const ba = a + s * Math.PI / 3;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(mx + Math.cos(ba) * ra, my + Math.sin(ba) * ra);
        ctx.stroke();
      }
    }
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.16, 0, Math.PI * 2);
    ctx.fill();
  }

  private copoDendrita(ctx: CanvasRenderingContext2D, r: number): void {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const cx = Math.cos(a), cy = Math.sin(a);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(cx * r, cy * r);
      ctx.stroke();
      for (let j = 1; j <= 2; j++) {
        const f = j / 3;
        const px = cx * r * f, py = cy * r * f;
        const ra = r * (0.28 - j * 0.04);
        for (const s of [-1, 1]) {
          const ba = a + s * Math.PI / 3;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + Math.cos(ba) * ra, py + Math.sin(ba) * ra);
          ctx.stroke();
        }
      }
    }
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
    ctx.fill();
  }

  private generarParticulas(): void {
    const e    = this.efecto!;
    const cant = Math.floor((e.intensidad / 100) * 100) + 20;
    const p    = e.color_primario   ?? '#ffffff';
    const s    = e.color_secundario ?? p;
    const cols = [p, s, p, s, '#ffffff'];
    const w    = window.innerWidth;
    this.particulas = Array.from({ length: cant }, () => this.nuevaParticula(w, cols, e.tipo_efecto));
  }

  private nuevaParticula(w: number, cols: string[], tipo: string, y?: number): Particula {
    const shapes: Particula['shape'][] =
      tipo === 'hojas'     ? ['leaf'] :
      tipo === 'confetti'  ? ['rect', 'rect', 'circle'] :
      tipo === 'estrellas' ? ['star'] : ['circle'];
    return {
      x:     Math.random() * w,
      y:     y ?? -(Math.random() * window.innerHeight),
      vx:    (Math.random() - 0.5) * (tipo === 'hojas' ? 2.5 : 1.2),
      vy:    Math.random() * 2 + 1,
      size:  Math.random() * (tipo === 'confetti' ? 10 : 6) + 4,
      alpha: Math.random() * 0.5 + 0.5,
      color: cols[Math.floor(Math.random() * cols.length)],
      rot:   Math.random() * Math.PI * 2,
      vrot:  (Math.random() - 0.5) * 0.12,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    };
  }

  private animarOtros(w: number, h: number): void {
    const ctx  = this.ctx;
    const tipo = this.efecto!.tipo_efecto;
    const p    = this.efecto!.color_primario   ?? '#ffffff';
    const s    = this.efecto!.color_secundario ?? p;
    const cols = [p, s, p, s, '#ffffff'];

    ctx.clearRect(0, 0, w, h);

    for (const p of this.particulas) {
      p.x += p.vx; p.y += p.vy; p.rot += p.vrot;

      if (p.y > h + 20) Object.assign(p, this.nuevaParticula(w, cols, tipo, -20));
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 'circle')      { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
      else if (p.shape === 'rect')   { ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); }
      else if (p.shape === 'star')   { this.estrella(ctx, p.size); ctx.fill(); }
      else                           { ctx.beginPath(); ctx.ellipse(0, 0, p.size / 2, p.size, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    }
  }

  private loop(): void {
    if (!this.running) return;
    const w = this.canvasRef.nativeElement.width;
    const h = this.canvasRef.nativeElement.height;
    this.efecto!.tipo_efecto === 'nieve' ? this.animarNieve(w, h) : this.animarOtros(w, h);
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  private estrella(ctx: CanvasRenderingContext2D, size: number): void {
    const r = size / 2, ri = size / 4;
    let a = -(Math.PI / 2);
    const step = Math.PI / 5;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    for (let i = 0; i < 5; i++) {
      a += step; ctx.lineTo(Math.cos(a) * ri, Math.sin(a) * ri);
      a += step; ctx.lineTo(Math.cos(a) * r,  Math.sin(a) * r);
    }
    ctx.closePath();
  }
}
