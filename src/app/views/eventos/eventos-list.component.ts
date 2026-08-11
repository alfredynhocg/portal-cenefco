import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { EventoService } from '../../eventos/application/services/evento.service';
import { Evento } from '../../eventos/domain/models/evento.model';
import { EVENTOS } from '@core/constants/eventos.constance';
import { createPaginatedList } from '../../core/utils/paginated-list';

@Component({
    selector: 'app-eventos-list',
    imports: [BreadcrumbComponent, CommonModule, RouterLink],
    templateUrl: './eventos-list.component.html',
    styles: [`
        :host ::ng-deep .hero1-section-area.about-bg-area {
            padding-top: 150px !important;
            padding-bottom: 80px !important;
            min-height: unset !important;
            height: auto !important;
        }
        :host ::ng-deep .blog1-section-area.sp1 {
            padding-top: 40px !important;
        }
        .estado-badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 600;
            padding: 3px 10px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }
        .estado-programado { background: #cce5ff; color: #004085; }
        .estado-en_curso   { background: #d4edda; color: #155724; }
        .estado-finalizado { background: #e2e3e5; color: #383d41; }
        .estado-cancelado  { background: #f8d7da; color: #721c24; }
        .evento-meta {
            font-size: 13px;
            color: #888;
            margin-bottom: 6px;
        }
        .evento-meta i { margin-right: 5px; color: #c1272d; }
    `]
})
export class EventosListComponent implements OnInit {
    private eventoService = inject(EventoService);
    private cdr = inject(ChangeDetectorRef);
    private list = createPaginatedList<Evento>({
        fetchFn: (pageIndex, pageSize) => this.eventoService.getPaginado(pageIndex, pageSize),
        cdr: this.cdr,
        pageSize: 9,
    });

    readonly CONSTANTS = EVENTOS;

    get eventos()    { return this.list.items; }
    get total()      { return this.list.total; }
    get cargando()   { return this.list.cargando; }
    get pageIndex()  { return this.list.pageIndex; }
    get totalPages() { return this.list.totalPages(); }
    get pages()      { return this.list.pages(); }

    ngOnInit(): void { this.list.cargar(); }
    goToPage(page: number): void { this.list.goToPage(page); }

    estadoClass(estado: string): string {
        const map: Record<string, string> = {
            programado: 'estado-badge estado-programado',
            en_curso:   'estado-badge estado-en_curso',
            finalizado: 'estado-badge estado-finalizado',
            cancelado:  'estado-badge estado-cancelado',
        };
        return map[estado] ?? 'estado-badge estado-programado';
    }

    estadoLabel(estado: string): string {
        const key = estado.toLowerCase() as keyof typeof EVENTOS.estados;
        return this.CONSTANTS.estados[key] ?? estado;
    }
}
