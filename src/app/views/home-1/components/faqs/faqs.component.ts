import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PreguntaFrecuente } from '../../../../preguntas-frecuentes/domain/models/pregunta-frecuente.model';
import { PreguntaFrecuenteService } from '../../../../preguntas-frecuentes/application/services/pregunta-frecuente.service';

@Component({
  selector: 'app-faqs',
  imports: [NgbAccordionModule, CommonModule, RouterLink],
  templateUrl: './faqs.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`

    .cf-section { background: #fff; }

    .cf-badge {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: rgba(18,138,162,0.08);
        color: #128AA2;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.4px;
        padding: 6px 16px;
        border-radius: 20px;
        border: 1px solid rgba(18,138,162,0.15);
        margin-bottom: 18px;
    }
    .cf-badge i { color: #FC8900; }

    .cf-title {
        font-size: clamp(26px, 3.5vw, 38px);
        font-weight: 800;
        color: #128AA2;
        line-height: 1.2;
        margin-bottom: 16px;
    }
    .cf-desc {
        font-size: 15px;
        color: #666;
        line-height: 1.75;
        margin-bottom: 20px;
    }

    .cf-count {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        font-size: 13px;
        color: #128AA2;
        font-weight: 600;
        margin-bottom: 16px;
    }
    .cf-count i { color: #FC8900; }

    .cf-cats {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 28px;
    }
    .cf-cat-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        font-weight: 600;
        color: #128AA2;
        background: rgba(18,138,162,0.07);
        border: 1px solid rgba(18,138,162,0.12);
        padding: 4px 12px;
        border-radius: 20px;
    }
    .cf-cat-chip i { font-size: 10px; color: #FC8900; }

    .cf-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #128AA2;
        color: #fff;
        font-size: 15px;
        font-weight: 700;
        padding: 14px 28px;
        border-radius: 10px;
        text-decoration: none;
        transition: all .3s ease;
        margin-top: 4px;
    }
    .cf-btn:hover {
        background: #FC8900;
        color: #fff;
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(252,137,0,0.28);
    }
    .cf-btn i { font-size: 13px; }

    .cf-skeleton {
        background: #f3f4f6;
        border-radius: 12px;
        height: 62px;
        margin-bottom: 12px;
        animation: cf-pulse 1.4s ease-in-out infinite;
    }
    @keyframes cf-pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: .45; }
    }

    .cf-empty {
        text-align: center;
        padding: 48px 24px;
        color: #aaa;
    }
    .cf-empty i { font-size: 40px; margin-bottom: 12px; display: block; }
    .cf-empty p { margin: 0; font-size: 14px; }

    .cf-accordion { display: flex; flex-direction: column; gap: 10px; }

    .cf-item {
        border-radius: 12px !important;
        border: 1px solid rgba(18,138,162,0.10) !important;
        overflow: hidden;
        background: #fff;
        transition: box-shadow .25s ease;
    }
    .cf-item:has(.cf-item-btn[aria-expanded="true"]) {
        border-color: rgba(18,138,162,0.25) !important;
        box-shadow: 0 4px 20px rgba(18,138,162,0.10);
    }

    .cf-item-btn {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        width: 100% !important;
        background: #fff !important;
        border: none !important;
        padding: 18px 20px !important;
        text-align: left !important;
        cursor: pointer !important;
        box-shadow: none !important;
        outline: none !important;
    }
    .cf-item-btn::after { display: none !important; }

    .cf-item-icon {
        flex-shrink: 0;
        width: 34px;
        height: 34px;
        border-radius: 8px;
        background: rgba(252,137,0,0.10);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FC8900;
        font-size: 14px;
        transition: background .2s;
    }
    .cf-item-btn[aria-expanded="true"] .cf-item-icon {
        background: #FC8900;
        color: #fff;
    }

    .cf-item-question {
        flex: 1;
        font-size: 14.5px;
        font-weight: 600;
        color: #128AA2;
        line-height: 1.4;
    }
    .cf-item-btn[aria-expanded="true"] .cf-item-question {
        color: #128AA2;
    }

    .cf-item-chevron {
        flex-shrink: 0;
        color: #aaa;
        font-size: 13px;
        transition: transform .3s ease, color .2s;
    }
    .cf-item-btn[aria-expanded="true"] .cf-item-chevron {
        transform: rotate(180deg);
        color: #FC8900;
    }

    .cf-item-body {
        padding: 0 20px 20px 66px !important;
    }
    .cf-cat-tag {
        display: inline-block;
        background: rgba(18,138,162,0.07);
        color: #128AA2;
        font-size: 11px;
        font-weight: 700;
        padding: 3px 10px;
        border-radius: 20px;
        margin-bottom: 10px;
        text-transform: capitalize;
        letter-spacing: 0.3px;
    }
    .cf-answer {
        font-size: 14px;
        color: #555;
        line-height: 1.7;
        margin: 0;
    }

    @media (max-width: 991px) {
        .cf-item-body { padding: 0 16px 18px 16px !important; }
    }
  `]
})
export class FaqsComponent implements OnInit {
  private faqService = inject(PreguntaFrecuenteService);
  private cdr        = inject(ChangeDetectorRef);

  faqs: PreguntaFrecuente[] = [];
  loading = true;
  error = false;

  readonly skeletons = [1, 2, 3, 4];

  private readonly categoriaIconMap: Record<string, string> = {
    inscripciones: 'fa-file-contract',
    certificados:  'fa-certificate',
    pagos:         'fa-credit-card',
    modalidad:     'fa-laptop',
    general:       'fa-circle-question',
  };

  private readonly categoriaLabelMap: Record<string, string> = {
    inscripciones: 'Inscripciones',
    certificados:  'Certificados',
    pagos:         'Pagos',
    modalidad:     'Modalidad',
    general:       'General',
  };

  categoriaIcon(cat: string | null): string {
    return this.categoriaIconMap[cat ?? ''] ?? 'fa-circle-question';
  }

  categoriaLabel(cat: string | null): string {
    return this.categoriaLabelMap[cat ?? ''] ?? (cat ?? '');
  }

  ngOnInit(): void {
    this.faqService.getAll(6).subscribe({
      next: (res) => {
        this.faqs = res.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.error = true;
        this.cdr.detectChanges();
      }
    });
  }
}
