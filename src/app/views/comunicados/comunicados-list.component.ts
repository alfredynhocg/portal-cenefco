import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { COMUNICADOS } from '@core/constants/comunicado.constance';
import { ComunicadoService } from '../../comunicados/application/services/comunicado.service';
import { Comunicado } from '../../comunicados/domain/models/comunicado.model';
import { createPaginatedList } from '../../core/utils/paginated-list';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';

@Component({
    selector: 'app-comunicados-list',
    imports: [BreadcrumbComponent, CommonModule, RouterLink, ImageUrlPipe],
    templateUrl: './comunicados-list.component.html',
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
    `]
})
export class ComunicadosListComponent implements OnInit {
    private comunicadoService = inject(ComunicadoService);
    private cdr = inject(ChangeDetectorRef);
    private list = createPaginatedList<Comunicado>({
        fetchFn: (pageIndex, pageSize) => this.comunicadoService.getPaginado(pageIndex, pageSize),
        cdr: this.cdr,
        pageSize: 9,
    });

    readonly CONSTANTS = COMUNICADOS;

    get comunicados() { return this.list.items; }
    get total()       { return this.list.total; }
    get cargando()    { return this.list.cargando; }
    get pageIndex()   { return this.list.pageIndex; }
    get totalPages()  { return this.list.totalPages(); }
    get pages()       { return this.list.pages(); }

    ngOnInit(): void { this.list.cargar(); }
    goToPage(page: number): void { this.list.goToPage(page); }
}
