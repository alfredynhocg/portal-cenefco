import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { EventoService } from '../../eventos/application/services/evento.service';
import { Evento, EventoFoto } from '../../eventos/domain/models/evento.model';
import { EVENTOS } from '@core/constants/eventos.constance';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';

@Component({
    selector: 'app-evento-detail',
    imports: [BreadcrumbComponent, CommonModule, RouterLink, ImageUrlPipe],
    templateUrl: './evento-detail.component.html',
    styles: [`
        :host ::ng-deep .hero1-section-area.about-bg-area {
            padding-top: 150px !important;
            padding-bottom: 80px !important;
            min-height: unset !important;
            height: auto !important;
        }
        .estado-badge {
            display: inline-block;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 14px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .estado-programado { background: #cce5ff; color: #004085; }
        .estado-en_curso   { background: #d4edda; color: #155724; }
        .estado-finalizado { background: #e2e3e5; color: #383d41; }
        .estado-cancelado  { background: #f8d7da; color: #721c24; }
        .foto-galeria {
            width: 100%;
            height: 220px;
            object-fit: cover;
            border-radius: 6px;
            cursor: pointer;
            transition: opacity .2s;
        }
        .foto-galeria:hover { opacity: 0.85; }
    `]
})
export class EventoDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private eventoService = inject(EventoService);

    evento: Evento | null = null;
    fotos: EventoFoto[] = [];
    cargando = true;
    readonly CONSTANTS = EVENTOS;

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        forkJoin({
            evento: this.eventoService.getById(id),
            fotos:  this.eventoService.getFotos(id),
        }).subscribe({
            next: ({ evento, fotos }) => {
                this.evento  = evento;
                this.fotos   = fotos;
                this.cargando = false;
            },
            error: () => { this.cargando = false; }
        });
    }

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
