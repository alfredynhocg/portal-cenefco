import { Component, inject, OnInit, ChangeDetectorRef, ViewEncapsulation, HostListener } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { FotoService } from '../../fotos/application/services/foto.service';
import { Foto } from '../../fotos/domain/models/foto.model';
import { createPaginatedList } from '../../core/utils/paginated-list';
import { GALERIA_FOTOS } from '../../core/constants/galeria-fotos';

@Component({
  selector: 'app-galeria-fotos',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './galeria-fotos.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './galeria-fotos.component.scss',
})
export class GaleriaFotosComponent implements OnInit {
  private service  = inject(FotoService);
  private cdr      = inject(ChangeDetectorRef);
  private document = inject<Document>(DOCUMENT);
  private list    = createPaginatedList<Foto>({
    fetchFn: (pageIndex, pageSize) => this.service.getPaginado(pageIndex, pageSize),
    cdr: this.cdr,
    pageSize: 12,
  });

  readonly textos = GALERIA_FOTOS;

  fotoActiva: Foto | null = null;
  fotoActivaIndex = 0;

  get items()      { return this.list.items; }
  get total()      { return this.list.total; }
  get cargando()   { return this.list.cargando; }
  get pageIndex()  { return this.list.pageIndex; }
  get totalPages() { return this.list.totalPages(); }
  get pages()      { return this.list.pages(); }

  ngOnInit(): void { this.list.cargar(); }
  goToPage(page: number): void { this.list.goToPage(page); }

  abrirLightbox(foto: Foto, index: number): void {
    this.fotoActiva = foto;
    this.fotoActivaIndex = index;
    this.document.body.style.overflow = 'hidden';
  }

  cerrarLightbox(): void {
    this.fotoActiva = null;
    this.document.body.style.overflow = '';
  }

  fotoAnterior(): void {
    this.fotoActivaIndex = (this.fotoActivaIndex - 1 + this.items.length) % this.items.length;
    this.fotoActiva = this.items[this.fotoActivaIndex];
  }

  fotoSiguiente(): void {
    this.fotoActivaIndex = (this.fotoActivaIndex + 1) % this.items.length;
    this.fotoActiva = this.items[this.fotoActivaIndex];
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.fotoActiva) return;
    if (event.key === 'Escape') this.cerrarLightbox();
    if (event.key === 'ArrowLeft') this.fotoAnterior();
    if (event.key === 'ArrowRight') this.fotoSiguiente();
  }
}
