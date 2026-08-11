import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { NoticiaService } from '../../noticias/application/services/noticia.service';
import { Noticia } from '../../noticias/domain/models/noticia.model';
import { NOTICIAS } from '@core/constants/noticia.constance';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-noticia-detail',
  imports: [BreadcrumbComponent, CommonModule, RouterLink, ImageUrlPipe],
  providers: [ImageUrlPipe],
  templateUrl: './noticia-detail.component.html',
  styles: [`
    :host ::ng-deep .hero1-section-area.about-bg-area {
        padding-top: 150px !important;
        padding-bottom: 80px !important;
        min-height: unset !important;
        height: auto !important;
    }
  `]
})
export class NoticiaDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private noticiaService = inject(NoticiaService);
  private document = inject<Document>(DOCUMENT);
  private meta = inject(Meta);
  private titleService = inject(Title);
  private imageUrlPipe = inject(ImageUrlPipe);

  noticia: Noticia | null = null;
  cargando = true;
  currentUrl = '';
  readonly CONSTANTS = NOTICIAS;
  private sub: Subscription | null = null;

  get shareUrls() {
    const url = this.currentUrl;
    const texto = encodeURIComponent((this.noticia?.titulo ?? '') + ' ');
    return {
      linkedin:  `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp:  `https://wa.me/?text=${texto}${url}`,
      twitter:   `https://twitter.com/intent/tweet?url=${url}&text=${texto}`,
    };
  }

  ngOnInit(): void {
    this.sub = this.route.paramMap.pipe(
      switchMap(params => {
        this.noticia = null;
        this.cargando = true;
        this.currentUrl = encodeURIComponent(this.document.location.href);
        return this.noticiaService.getBySlug(params.get('slug') ?? '');
      })
    ).subscribe({
      next: (data) => {
        this.noticia = data;
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

  private setMetaTags(noticia: Noticia): void {
    const url = this.document.location.href;
    const titulo = noticia.titulo;
    const descripcion = noticia.entradilla ?? titulo;
    const imagen = this.imageUrlPipe.transform(noticia.imagen_principal_url) ?? '';

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
