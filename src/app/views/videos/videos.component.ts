import { Component, inject, OnInit, DoCheck, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { GaleriaVideoService } from '../../galeria-videos/application/services/galeria-video.service';
import { GaleriaVideo } from '../../galeria-videos/domain/models/galeria-video.model';
import { createPaginatedList } from '../../core/utils/paginated-list';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './videos.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './videos.component.scss',
})
export class VideosComponent implements OnInit, DoCheck {
  private service   = inject(GaleriaVideoService);
  private sanitizer = inject(DomSanitizer);
  private cdr       = inject(ChangeDetectorRef);
  private http      = inject(HttpClient);
  private list      = createPaginatedList<GaleriaVideo>({
    fetchFn: (pageIndex, pageSize) => this.service.getPaginado(pageIndex, pageSize),
    cdr: this.cdr,
    pageSize: 12,
  });

  private tiktokThumbnails = new Map<number, string>();
  private ultimosItemsProcesados: GaleriaVideo[] | null = null;

  ngDoCheck(): void {
    if (this.items !== this.ultimosItemsProcesados) {
      this.ultimosItemsProcesados = this.items;
      this.cargarMiniaturasTikTok();
    }
  }

  private cargarMiniaturasTikTok(): void {
    for (const video of this.items) {
      if (video.plataforma === 'tiktok' && !video.miniatura_url && !this.tiktokThumbnails.has(video.id)) {
        this.tiktokThumbnails.set(video.id, '');
        this.http.get<{ thumbnail_url?: string }>('https://www.tiktok.com/oembed', {
          params: { url: video.url_video },
        }).subscribe({
          next: (res) => {
            if (res.thumbnail_url) {
              this.tiktokThumbnails.set(video.id, res.thumbnail_url);
              this.cdr.detectChanges();
            }
          },
          error: () => {  },
        });
      }
    }
  }

  videoActivo: GaleriaVideo | null = null;
  embedUrl: SafeResourceUrl | null = null;

  get items()      { return this.list.items; }
  get total()      { return this.list.total; }
  get cargando()   { return this.list.cargando; }
  get pageIndex()  { return this.list.pageIndex; }
  get totalPages() { return this.list.totalPages(); }
  get pages()      { return this.list.pages(); }

  ngOnInit(): void { this.list.cargar(); }
  goToPage(page: number): void { this.list.goToPage(page); }

  abrirVideo(video: GaleriaVideo): void {
    this.videoActivo = video;
    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getEmbedUrl(video));
    this.cdr.detectChanges();
  }

  cerrarVideo(): void {
    this.videoActivo = null;
    this.embedUrl    = null;
    this.cdr.detectChanges();
  }

  getThumbnail(video: GaleriaVideo): string {
    if (video.miniatura_url) return video.miniatura_url;
    if (video.plataforma === 'youtube' && video.video_id)
      return `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`;
    if (video.plataforma === 'tiktok') {
      const cached = this.tiktokThumbnails.get(video.id);
      if (cached) return cached;
    }
    return 'assets/img/placeholder-video.svg';
  }

  getEmbedUrl(video: GaleriaVideo): string {
    if (video.plataforma === 'youtube' && video.video_id)
      return `https://www.youtube.com/embed/${video.video_id}?autoplay=1&rel=0`;
    if (video.plataforma === 'vimeo' && video.video_id)
      return `https://player.vimeo.com/video/${video.video_id}?autoplay=1`;
    if (video.plataforma === 'tiktok' && video.video_id)
      return `https://www.tiktok.com/embed/v2/${video.video_id}`;
    return video.url_video;
  }

  getPlatIcon(plat: string | null): string {
    const map: Record<string, string> = {
      youtube:  'fa-brands fa-youtube',
      vimeo:    'fa-brands fa-vimeo',
      tiktok:   'fa-brands fa-tiktok',
      facebook: 'fa-brands fa-facebook',
    };
    return map[plat ?? ''] ?? 'fa-solid fa-play';
  }

  getPlatLabel(plat: string | null): string {
    const map: Record<string, string> = { youtube: 'YouTube', vimeo: 'Vimeo', tiktok: 'TikTok', facebook: 'Facebook' };
    return map[plat ?? ''] ?? 'Video';
  }

  tipoLabel(tipo: string | null): string {
    if (!tipo) return '';
    const map: Record<string, string> = {
      institucional: 'Institucional',
      programa:      'Programa',
      academico:     'Académico',
      evento:        'Evento',
    };
    return map[tipo] ?? tipo;
  }
}
