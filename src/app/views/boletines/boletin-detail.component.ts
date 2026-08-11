import { Component, inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { BoletinService } from '../../boletines/application/services/boletin.service';
import { Boletin } from '../../boletines/domain/models/boletin.model';
import { BOLETINES } from '@core/constants/boletin.constance';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-boletin-detail',
  imports: [BreadcrumbComponent, CommonModule, RouterLink, ImageUrlPipe],
  providers: [ImageUrlPipe],
  templateUrl: './boletin-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`

    .bd-hero {
        position: relative;
        min-height: 240px;
        display: flex;
        align-items: flex-end;
        overflow: hidden;
        background: #128AA2;
    }
    .bd-hero-bg {
        position: absolute; inset: 0;
        width: 100%; height: 100%;
        object-fit: cover; opacity: 0.22;
    }
    .bd-hero-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(180deg, rgba(18,138,162,0.50) 0%, rgba(18,138,162,0.92) 100%);
    }
    .bd-hero-body {
        position: relative; z-index: 1;
        padding: 40px 0 32px; width: 100%; text-align: center;
    }
    .bd-hero-title {
        font-size: clamp(22px, 3.4vw, 36px); font-weight: 800;
        color: #fff; line-height: 1.25; margin-bottom: 14px;
        max-width: 780px; margin-left: auto; margin-right: auto;
    }

    .bd-section { background: #f4f7f9; padding: 48px 0 80px; }

    .bd-loading, .bd-notfound { text-align: center; padding: 80px 24px; color: #888; }
    .bd-notfound i { font-size: 48px; margin-bottom: 16px; display: block; color: #dde4e8; }

    .bd-article {
        background: #fff; border-radius: 18px; overflow: hidden;
        border: 1px solid rgba(18,138,162,0.08);
        box-shadow: 0 6px 28px rgba(18,138,162,0.08);
        max-width: 860px; margin: -60px auto 0;
        position: relative; z-index: 2;
    }

    .bd-cover { position: relative; width: 100%; }
    .bd-cover img {
        width: 100%; max-height: 420px; object-fit: cover; display: block;
    }

    .bd-body { padding: 34px 32px 42px; }

    .bd-meta {
        display: flex; align-items: center; flex-wrap: wrap;
        gap: 10px 18px; margin-bottom: 18px;
    }
    .bd-meta-item {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 13px; color: #6b7280; font-weight: 600;
    }
    .bd-meta-item i { color: #FC8900; font-size: 12px; }
    .bd-tag {
        display: inline-flex; align-items: center; gap: 5px;
        background: rgba(18,138,162,0.08); color: #128AA2;
        font-size: 11.5px; font-weight: 700;
        padding: 4px 12px; border-radius: 20px;
    }

    .bd-title {
        font-size: clamp(22px, 3vw, 32px); font-weight: 800;
        color: #0a2433; line-height: 1.25; margin-bottom: 14px;
    }

    .bd-content {
        font-size: 15.5px; line-height: 1.9; color: #333;
        white-space: pre-line;
    }

    .bd-back {
        display: inline-flex; align-items: center; gap: 8px;
        margin-top: 30px; padding-top: 24px; border-top: 1px solid rgba(18,138,162,0.10);
        font-size: 13.5px; font-weight: 700;
        color: #128AA2; text-decoration: none;
    }
    .bd-back:hover { color: #FC8900; }

    @media (max-width: 767px) {
        .bd-article { margin-top: -32px; border-radius: 16px; }
        .bd-body { padding: 24px 20px 30px; }
        .bd-cover img { max-height: 240px; }
    }
  `]
})
export class BoletinDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private boletinService = inject(BoletinService);
  private document = inject<Document>(DOCUMENT);
  private meta = inject(Meta);
  private titleService = inject(Title);
  private imageUrlPipe = inject(ImageUrlPipe);

  boletin: Boletin | null = null;
  cargando = true;
  readonly CONSTANTS = BOLETINES;
  private sub: Subscription | null = null;

  ngOnInit(): void {
    this.sub = this.route.paramMap.pipe(
      switchMap(params => {
        this.boletin = null;
        this.cargando = true;
        return this.boletinService.getBySlug(params.get('slug') ?? '');
      })
    ).subscribe({
      next: (data) => {
        this.boletin = data;
        this.cargando = false;
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
  }

  private setMetaTags(boletin: Boletin): void {
    const url = this.document.location.href;
    const titulo = boletin.titulo_pagina || boletin.titulo_boletin;
    const descripcion = boletin.descripcion_boletin || titulo;
    const imagen = this.imageUrlPipe.transform(boletin.imagen_url) ?? '';

    this.titleService.setTitle(`${titulo} | CENEFCO`);

    this.meta.updateTag({ property: 'og:type',        content: 'article' });
    this.meta.updateTag({ property: 'og:title',       content: titulo });
    this.meta.updateTag({ property: 'og:description', content: descripcion });
    this.meta.updateTag({ property: 'og:url',         content: url });
    this.meta.updateTag({ property: 'og:image',       content: imagen });
  }
}
