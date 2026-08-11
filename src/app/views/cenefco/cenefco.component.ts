import { Component, inject, signal, computed, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaqsComponent } from './components/faqs/faqs.component';
import { ContactComponent } from './components/contact/contact.component';
import { HitosInstitucionalesComponent } from './components/hitos-institucionales/hitos-institucionales.component';
import { AcreditacionesComponent } from './components/acreditaciones/acreditaciones.component';
import { ConfiguracionService } from '../../configuracion/application/services/configuracion.service';
import { ConfiguracionPublica } from '../../configuracion/domain/models/configuracion.model';
import { CommonModule } from '@angular/common';

interface ValorItem { titulo: string; descripcion: string; raw: string; }

const VALOR_ICONS: Record<string, string> = {
  'Calidad':     'fa-solid fa-medal',
  'Innovación':  'fa-solid fa-lightbulb',
  'Integridad':  'fa-solid fa-shield-halved',
  'Compromiso':  'fa-solid fa-handshake',
  'Inclusión':   'fa-solid fa-users',
};
const VALOR_ICONS_FALLBACK = [
  'fa-solid fa-star',
  'fa-solid fa-bolt',
  'fa-solid fa-gem',
  'fa-solid fa-leaf',
  'fa-solid fa-heart',
];

@Component({
    selector: 'app-cenefco',
    imports: [CommonModule, RouterLink, FaqsComponent, ContactComponent, HitosInstitucionalesComponent, AcreditacionesComponent],
    templateUrl: './cenefco.component.html',
    styles: ``
})
export class CenefcoComponent implements OnInit {
    private configService = inject(ConfiguracionService);
    private cdr           = inject(ChangeDetectorRef);

    config = signal<ConfiguracionPublica | null>(null);

    valoresList = computed<ValorItem[]>(() => {
        const raw = this.config()?.valores ?? '';
        if (!raw.trim()) return [];
        return raw.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                const colonIdx = line.indexOf(':');
                if (colonIdx > 0 && colonIdx < 40) {
                    return {
                        titulo:      line.slice(0, colonIdx).trim(),
                        descripcion: line.slice(colonIdx + 1).trim(),
                        raw:         line,
                    };
                }
                return { titulo: '', descripcion: '', raw: line };
            });
    });

    iconFor(titulo: string, index: number): string {
        return VALOR_ICONS[titulo] ?? VALOR_ICONS_FALLBACK[index % VALOR_ICONS_FALLBACK.length];
    }

    ngOnInit(): void {
        this.configService.getPublicaWeb().subscribe({
            next: (res) => {
                this.config.set(res.data);
                this.cdr.detectChanges();
            },
            error: () => this.cdr.detectChanges(),
        });
    }
}
