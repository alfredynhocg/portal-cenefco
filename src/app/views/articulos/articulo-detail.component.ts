import { Component, inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { ArticuloService } from '../../articulos/application/services/articulo.service';
import { Articulo } from '../../articulos/domain/models/articulo.model';
import { ARTICULOS } from '@core/constants/articulo.constance';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-articulo-detail',
  imports: [BreadcrumbComponent, CommonModule, RouterLink, ImageUrlPipe],
  providers: [ImageUrlPipe],
  templateUrl: './articulo-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`

    .ad-hero {
        position: relative;
        min-height: 240px;
        display: flex;
        align-items: flex-end;
        overflow: hidden;
        background: #128AA2;
    }
    .ad-hero-bg {
        position: absolute; inset: 0;
        width: 100%; height: 100%;
        object-fit: cover; opacity: 0.22;
    }
    .ad-hero-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(180deg, rgba(18,138,162,0.50) 0%, rgba(18,138,162,0.92) 100%);
    }
    .ad-hero-body {
        position: relative; z-index: 1;
        padding: 40px 0 32px; width: 100%; text-align: center;
    }
    .ad-hero-title {
        font-size: clamp(22px, 3.4vw, 36px); font-weight: 800;
        color: #fff; line-height: 1.25; margin-bottom: 14px;
        max-width: 780px; margin-left: auto; margin-right: auto;
    }

    .ad-section { background: #f4f7f9; padding: 48px 0 80px; }

    .ad-loading, .ad-notfound { text-align: center; padding: 80px 24px; color: #888; }
    .ad-notfound i { font-size: 48px; margin-bottom: 16px; display: block; color: #dde4e8; }

    .ad-article {
        background: #fff; border-radius: 18px; overflow: hidden;
        border: 1px solid rgba(18,138,162,0.08);
        box-shadow: 0 6px 28px rgba(18,138,162,0.08);
        max-width: 860px; margin: -60px auto 0;
        position: relative; z-index: 2;
    }

    .ad-cover { position: relative; width: 100%; }
    .ad-cover img {
        width: 100%; max-height: 420px; object-fit: cover; display: block;
    }

    .ad-body { padding: 34px 32px 42px; }

    .ad-meta {
        display: flex; align-items: center; flex-wrap: wrap;
        gap: 10px 18px; margin-bottom: 18px;
    }
    .ad-meta-item {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 13px; color: #6b7280; font-weight: 600;
    }
    .ad-meta-item i { color: #FC8900; font-size: 12px; }
    .ad-tag {
        display: inline-flex; align-items: center; gap: 5px;
        background: rgba(18,138,162,0.08); color: #128AA2;
        font-size: 11.5px; font-weight: 700;
        padding: 4px 12px; border-radius: 20px;
    }
    .ad-tag--destacado { background: rgba(252,137,0,0.10); color: #d97400; }

    .ad-title {
        font-size: clamp(22px, 3vw, 32px); font-weight: 800;
        color: #0a2433; line-height: 1.25; margin-bottom: 14px;
    }
    .ad-entradilla {
        font-size: 16.5px; color: #444; font-weight: 500;
        line-height: 1.7; margin-bottom: 26px;
        padding-bottom: 26px; border-bottom: 1px solid rgba(18,138,162,0.10);
    }

    .ad-content {
        font-size: 15.5px; line-height: 1.9; color: #333;
    }
    .ad-content :is(h1,h2,h3,h4) { color: #128AA2; font-weight: 800; margin: 28px 0 14px; line-height: 1.3; }
    .ad-content h1 { font-size: 26px; }
    .ad-content h2 { font-size: 22px; }
    .ad-content h3 { font-size: 19px; }
    .ad-content p  { margin: 0 0 18px; }
    .ad-content a  { color: #128AA2; text-decoration: underline; text-underline-offset: 2px; }
    .ad-content a:hover { color: #FC8900; }
    .ad-content img { max-width: 100%; height: auto; border-radius: 10px; margin: 18px 0; }
    .ad-content ul, .ad-content ol { margin: 0 0 18px; padding-left: 24px; }
    .ad-content li { margin-bottom: 8px; }
    .ad-content blockquote {
        margin: 22px 0; padding: 16px 20px; border-left: 4px solid #FC8900;
        background: rgba(18,138,162,0.04); border-radius: 0 10px 10px 0;
        font-style: italic; color: #555;
    }
    .ad-content table { width: 100%; border-collapse: collapse; margin: 18px 0; }
    .ad-content table td, .ad-content table th { border: 1px solid #e2e8ec; padding: 8px 12px; }
    .ad-content figure { margin: 18px 0; }

    .ad-etiquetas {
        display: flex; flex-wrap: wrap; gap: 8px;
        margin-top: 30px; padding-top: 24px; border-top: 1px solid rgba(18,138,162,0.10);
    }
    .ad-etiqueta-chip {
        font-size: 12px; font-weight: 600; color: #128AA2;
        background: rgba(18,138,162,0.06); border: 1px solid rgba(18,138,162,0.15);
        border-radius: 20px; padding: 5px 13px;
    }

    .ad-back {
        display: inline-flex; align-items: center; gap: 8px;
        margin-top: 30px; padding-top: 24px; border-top: 1px solid rgba(18,138,162,0.10);
        font-size: 13.5px; font-weight: 700;
        color: #128AA2; text-decoration: none;
    }
    .ad-back:hover { color: #FC8900; }

    @media (max-width: 767px) {
        .ad-article { margin-top: -32px; border-radius: 16px; }
        .ad-body { padding: 24px 20px 30px; }
        .ad-cover img { max-height: 240px; }
    }
  `]
})
export class ArticuloDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private articuloService = inject(ArticuloService);
  private document = inject<Document>(DOCUMENT);
  private meta = inject(Meta);
  private titleService = inject(Title);
  private imageUrlPipe = inject(ImageUrlPipe);

  articulo: Articulo | null = null;
  cargando = true;
  currentUrl = '';
  readonly CONSTANTS = ARTICULOS;
  private sub: Subscription | null = null;

  ngOnInit(): void {
    this.sub = this.route.paramMap.pipe(
      switchMap(params => {
        this.articulo = null;
        this.cargando = true;
        this.currentUrl = encodeURIComponent(this.document.location.href);
        return this.articuloService.getBySlug(params.get('slug') ?? '');
      })
    ).subscribe({
      next: (data) => {
        this.articulo = data;
        this.cargando = false;
        this.currentUrl = encodeURIComponent(this.document.location.href);
        this.setMetaTags(data);
      },
      error: () => { this.cargando = false; }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.meta.removeTag("property='og:title'");
    this.meta.removeTag("property='og:description'");
    this.meta.removeTag("property='og:image'");
    this.meta.removeTag("property='og:url'");
    this.meta.removeTag("property='og:type'");
    this.meta.removeTag("name='twitter:card'");
    this.meta.removeTag("name='twitter:title'");
    this.meta.removeTag("name='twitter:description'");
    this.meta.removeTag("name='twitter:image'");
  }

  private setMetaTags(articulo: Articulo): void {
    const url = this.document.location.href;
    const titulo = articulo.meta_titulo || articulo.titulo;
    const descripcion = articulo.meta_descripcion || articulo.entradilla || titulo;
    const imagen = this.imageUrlPipe.transform(articulo.imagen_principal_url) ?? '';

    this.titleService.setTitle(`${titulo} | CENEFCO`);

    this.meta.updateTag({ property: 'og:type',        content: 'article' });
    this.meta.updateTag({ property: 'og:title',       content: titulo });
    this.meta.updateTag({ property: 'og:description', content: descripcion });
    this.meta.updateTag({ property: 'og:url',         content: url });
    this.meta.updateTag({ property: 'og:image',       content: imagen });

    this.meta.updateTag({ name: 'twitter:card',        content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title',       content: titulo });
    this.meta.updateTag({ name: 'twitter:description', content: descripcion });
    this.meta.updateTag({ name: 'twitter:image',       content: imagen });
  }
}
