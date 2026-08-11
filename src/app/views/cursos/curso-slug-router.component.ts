import { Component, OnDestroy, OnInit, Type, inject, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CursoDetailComponent } from './curso-detail.component';
import { CursoParticipantesComponent } from '../curso-participantes/curso-participantes.component';
import { CursoPasadoDetailComponent } from '../cursos-pasados/curso-pasado-detail.component';
import { AreaDetailComponent } from '../areas/area-detail.component';
import { CursoService } from '../../cursos/application/services/curso.service';
import { AreaPortalService } from '../../areas/application/services/area.service';

const SUFIJO_PARTICIPANTES = '-participantes';

@Component({
    selector: 'app-curso-slug-router',
    imports: [NgComponentOutlet],
    template: `@if (componente(); as c) { <ng-container [ngComponentOutlet]="c" /> }`,
})
export class CursoSlugRouterComponent implements OnInit, OnDestroy {
    private route        = inject(ActivatedRoute);
    private cursoService = inject(CursoService);
    private areaService  = inject(AreaPortalService);

    componente = signal<Type<unknown> | null>(null);
    private sub: Subscription | null = null;

    ngOnInit(): void {
        this.sub = this.route.paramMap.subscribe(params => {
            const slug = params.get('slug') ?? '';
            this.resolverSlug(slug);
        });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    private resolverSlug(slug: string): void {
        this.componente.set(null);

        if (slug.endsWith(SUFIJO_PARTICIPANTES)) {
            this.componente.set(CursoParticipantesComponent);
            return;
        }

        this.cursoService.getBySlug(slug).subscribe({
            next: () => this.componente.set(CursoDetailComponent),
            error: () => {
                this.areaService.getBySlug(slug).subscribe({
                    next: () => this.componente.set(AreaDetailComponent),
                    error: () => this.componente.set(CursoPasadoDetailComponent),
                });
            },
        });
    }
}
