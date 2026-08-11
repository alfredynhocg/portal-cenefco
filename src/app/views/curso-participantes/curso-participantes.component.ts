import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { CursoService } from '../../cursos/application/services/curso.service';
import { CursoParticipantes } from '../../cursos/domain/models/curso.model';

function normalizar(texto: string): string {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
}

const SUFIJO = '-participantes';

type Estado = 'loading' | 'found' | 'not_found' | 'error';

@Component({
    selector: 'app-curso-participantes',
    imports: [FormsModule, RouterLink, BreadcrumbComponent],
    templateUrl: './curso-participantes.component.html',
    styleUrls: ['./curso-participantes.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CursoParticipantesComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private cursoService = inject(CursoService);
    private cdr = inject(ChangeDetectorRef);

    estado: Estado = 'loading';
    resultado: CursoParticipantes | null = null;
    busqueda = '';
    slugCurso = '';
    gestion = new Date().getFullYear().toString();
    private sub: Subscription | null = null;

    ngOnInit(): void {
        this.sub = this.route.paramMap.pipe(
            switchMap(params => {
                const param = params.get('slug') ?? '';
                if (!param.endsWith(SUFIJO)) {
                    this.router.navigateByUrl('/');
                    return EMPTY;
                }

                this.estado = 'loading';
                this.resultado = null;
                this.busqueda = '';
                this.slugCurso = param.slice(0, -SUFIJO.length);
                this.cdr.detectChanges();
                return this.cursoService.getParticipantesBySlug(this.slugCurso);
            })
        ).subscribe({
            next: (res) => {
                this.resultado = res;
                this.estado = 'found';
                this.cdr.detectChanges();
            },
            error: (err: HttpErrorResponse) => {
                this.estado = err.status === 404 ? 'not_found' : 'error';
                this.cdr.detectChanges();
            },
        });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    iniciales(nombre: string): string {
        return nombre
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => s[0])
            .join('')
            .toUpperCase();
    }

    get participantesFiltrados(): string[] {
        const lista = this.resultado?.participantes ?? [];
        const query = normalizar(this.busqueda.trim());
        if (!query) return lista;
        return lista.filter((nombre) => normalizar(nombre).includes(query));
    }
}
