import { Component, inject, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { PreguntaFrecuenteService } from '../../preguntas-frecuentes/application/services/pregunta-frecuente.service';
import { PreguntaFrecuente } from '../../preguntas-frecuentes/domain/models/pregunta-frecuente.model';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbComponent],
  templateUrl: './faq.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .fq-hero {
      position: relative; min-height: 260px;
      display: flex; align-items: flex-end; overflow: hidden;
      background: #128AA2;
    }
    .fq-hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(18,138,162,0.45) 0%, rgba(18,138,162,0.92) 100%);
    }
    .fq-hero-body { position: relative; z-index: 1; padding: 48px 0 36px; width: 100%; text-align: center; }
    .fq-hero-badge {
      display: inline-flex; align-items: center; gap: 7px;
      background: rgba(255,255,255,0.12); color: #fff;
      font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
      padding: 5px 16px; border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.22); margin-bottom: 14px;
    }
    .fq-hero-badge i { color: #FC8900; }
    .fq-hero-title { font-size: clamp(26px, 4vw, 42px); font-weight: 800; color: #fff; margin-bottom: 10px; }
    .fq-hero-title span { color: #FC8900; }
    .fq-hero-sub { color: rgba(255,255,255,0.65); font-size: 15px; }

    .fq-section { background: #f4f7f9; padding: 52px 0 90px; }

    .fq-tabs { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 40px; }
    .fq-tab {
      padding: 8px 20px; border-radius: 30px; font-size: 13px; font-weight: 600;
      border: 1.5px solid rgba(18,138,162,0.18); background: #fff; color: #128AA2;
      cursor: pointer; transition: all .22s ease; text-transform: capitalize;
    }
    .fq-tab:hover { border-color: #128AA2; background: rgba(18,138,162,0.05); }
    .fq-tab.active { background: #128AA2; border-color: #128AA2; color: #fff; box-shadow: 0 3px 12px rgba(18,138,162,0.22); }

    .fq-group { margin-bottom: 36px; }
    .fq-group-title {
      font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
      color: #FC8900; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
    }
    .fq-group-title::after {
      content: ''; flex: 1; height: 1.5px; background: rgba(252,137,0,0.2); border-radius: 2px;
    }

    .fq-item {
      background: #fff; border-radius: 12px; margin-bottom: 10px;
      border: 1.5px solid rgba(18,138,162,0.08);
      box-shadow: 0 2px 10px rgba(18,138,162,0.05);
      overflow: hidden; transition: box-shadow .25s, border-color .25s;
    }
    .fq-item.open { border-color: rgba(18,138,162,0.22); box-shadow: 0 6px 24px rgba(18,138,162,0.10); }

    .fq-question {
      width: 100%; display: flex; align-items: center; justify-content: space-between;
      gap: 12px; padding: 18px 22px; background: none; border: none;
      text-align: left; cursor: pointer; transition: background .2s;
    }
    .fq-question:hover { background: rgba(18,138,162,0.02); }
    .fq-q-text { font-size: 15px; font-weight: 700; color: #128AA2; line-height: 1.4; flex: 1; }
    .fq-q-icon {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      background: rgba(18,138,162,0.08); display: flex; align-items: center; justify-content: center;
      transition: background .25s, transform .3s;
    }
    .fq-q-icon i { color: #128AA2; font-size: 11px; transition: transform .3s; }
    .fq-item.open .fq-q-icon { background: #128AA2; }
    .fq-item.open .fq-q-icon i { color: #fff; transform: rotate(45deg); }

    .fq-answer {
      max-height: 0; overflow: hidden;
      transition: max-height .35s ease, padding .35s ease;
      padding: 0 22px;
    }
    .fq-item.open .fq-answer { max-height: 500px; padding: 0 22px 20px; }
    .fq-answer p { margin: 0; font-size: 14.5px; color: #555; line-height: 1.75; }

    .fq-skel-item { background: #fff; border-radius: 12px; margin-bottom: 10px; padding: 18px 22px; border: 1.5px solid rgba(18,138,162,0.08); }
    .fq-skel-line { height: 14px; border-radius: 6px; background: #eef0f2; animation: fq-pulse 1.4s ease-in-out infinite; }
    .fq-skel-line.short { width: 45%; margin-top: 8px; }
    @keyframes fq-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }

    .fq-cta {
      margin-top: 56px; background: #128AA2; border-radius: 20px;
      padding: 40px 32px; text-align: center; position: relative; overflow: hidden;
    }
    .fq-cta::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(circle at 80% 20%, rgba(252,137,0,0.15) 0%, transparent 60%);
    }
    .fq-cta-title { color: #fff; font-size: 22px; font-weight: 800; margin-bottom: 10px; position: relative; }
    .fq-cta-sub { color: rgba(255,255,255,0.65); font-size: 14.5px; margin-bottom: 24px; position: relative; }
    .fq-cta-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: #FC8900; color: #fff; padding: 12px 28px;
      border-radius: 8px; font-weight: 700; font-size: 14px;
      text-decoration: none; transition: background .2s; position: relative;
    }
    .fq-cta-btn:hover { background: #e07a00; color: #fff; }

    @media (max-width: 767px) {
      .fq-hero-body { padding: 32px 0 24px; }
      .fq-question { padding: 15px 16px; }
      .fq-item.open .fq-answer { padding: 0 16px 16px; }
    }
  `]
})
export class FaqComponent implements OnInit {
  private service = inject(PreguntaFrecuenteService);
  private cdr     = inject(ChangeDetectorRef);

  preguntas: PreguntaFrecuente[]       = [];
  cargando                              = true;
  categoriaActiva: string | null        = null;
  abiertos: Set<number>                 = new Set();

  get categorias(): string[] {
    const cats = this.preguntas
      .map(p => p.categoria ?? 'general')
      .filter((v, i, a) => a.indexOf(v) === i);
    return cats;
  }

  get preguntasFiltradas(): PreguntaFrecuente[] {
    if (!this.categoriaActiva) return this.preguntas;
    return this.preguntas.filter(p => (p.categoria ?? 'general') === this.categoriaActiva);
  }

  get grupos(): { cat: string; items: PreguntaFrecuente[] }[] {
    if (this.categoriaActiva) {
      return [{ cat: this.categoriaActiva, items: this.preguntasFiltradas }];
    }
    return this.categorias.map(cat => ({
      cat,
      items: this.preguntas.filter(p => (p.categoria ?? 'general') === cat)
    }));
  }

  ngOnInit(): void {
    this.service.getAll(50).subscribe({
      next: (res) => {
        this.preguntas = res.data;
        if (this.preguntas.length > 0) {
          this.abiertos.add(this.preguntas[0].id);
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrarPor(cat: string | null): void {
    this.categoriaActiva = cat;
    this.abiertos.clear();
    const primera = this.preguntasFiltradas[0];
    if (primera) this.abiertos.add(primera.id);
    this.cdr.detectChanges();
  }

  toggle(id: number): void {
    if (this.abiertos.has(id)) this.abiertos.delete(id);
    else this.abiertos.add(id);
    this.cdr.detectChanges();
  }

  isOpen(id: number): boolean { return this.abiertos.has(id); }

  catLabel(cat: string): string {
    const map: Record<string, string> = {
      inscripciones: 'Inscripciones',
      certificados:  'Certificados',
      pagos:         'Pagos',
      general:       'General',
      academico:     'Académico',
    };
    return map[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1);
  }
}
