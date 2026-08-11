import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { ComunicadoService } from '../../comunicados/application/services/comunicado.service';
import { Comunicado } from '../../comunicados/domain/models/comunicado.model';
import { environment } from '../../../environments/environment';
import { COMUNICADOS } from '@core/constants/comunicado.constance';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-comunicado-detail',
  imports: [BreadcrumbComponent, CommonModule, RouterLink, ImageUrlPipe],
  templateUrl: './comunicado-detail.component.html',
  styles: [`
    :host ::ng-deep .hero1-section-area.about-bg-area {
        padding-top: 150px !important;
        padding-bottom: 80px !important;
        min-height: unset !important;
        height: auto !important;
    }
  `]
})
export class ComunicadoDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private comunicadoService = inject(ComunicadoService);
  private document = inject(DOCUMENT);
  private meta = inject(Meta);
  private titleService = inject(Title);

  comunicado: Comunicado | null = null;
  cargando = true;
  currentUrl = '';
  readonly CONSTANTS = COMUNICADOS;
  private sub: Subscription | null = null;

  get shareUrls() {
    const url = this.currentUrl;
    const texto = encodeURIComponent((this.comunicado?.titulo ?? '') + ' ');
    return {
      linkedin:  `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp:  `https://wa.me/?text=${texto}${url}`,
      twitter:   `https://twitter.com/intent/tweet?url=${url}&text=${texto}`,
    };
  }

  ngOnInit(): void {
    this.sub = this.route.paramMap.pipe(
      switchMap(params => {
        this.comunicado = null;
        this.cargando = true;
        this.currentUrl = encodeURIComponent(this.document.location.href);
        return this.comunicadoService.getBySlug(params.get('slug') ?? '');
      })
    ).subscribe({
      next: (data) => {
        this.comunicado = data;
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

  private setMetaTags(comunicado: Comunicado): void {
    const url = this.document.location.href;
    const titulo = comunicado.titulo;
    const descripcion = comunicado.resumen ?? titulo;
    const base = 'http';
    const imagen = comunicado.imagen_url
      ? (comunicado.imagen_url.startsWith(base) ? comunicado.imagen_url : (environment.apiBaseUrl + comunicado.imagen_url))
      : '';

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
