import { ChangeDetectorRef, Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../menus/application/services/menu.service';
import { MenuItem } from '../../menus/domain/models/menu.model';
import { ConfiguracionService } from '../../configuracion/application/services/configuracion.service';
import { ConfiguracionSitio } from '../../configuracion/domain/models/configuracion.model';
import { RedSocialService } from '../../redes-sociales/application/services/red-social.service';
import { RedSocial } from '../../redes-sociales/domain/models/red-social.model';

@Component({
    selector: 'app-footer',
    imports: [CommonModule, RouterLink],
    templateUrl: './footer.component.html',
    styles: ``
})
export class FooterComponent implements OnInit {
    currentYear = new Date().getFullYear();

    @Input() logo!: string;
    @Input() containerClass!: string;

    private menuService = inject(MenuService);
    private configuracionService = inject(ConfiguracionService);
    private redSocialService = inject(RedSocialService);
    private cdr = inject(ChangeDetectorRef);

    footerItems: MenuItem[] = [];
    config = signal<ConfiguracionSitio>({});
    redesSociales = signal<RedSocial[]>([]);

    isExternal(url: string | null): boolean {
        return !!url && (url.startsWith('http://') || url.startsWith('https://'));
    }

    ngOnInit(): void {
        this.menuService.getMenuItems('menu-footer').subscribe({
            next: (items) => { this.footerItems = items; this.cdr.detectChanges(); },
            error: () => {}
        });

        this.configuracionService.getPublica().subscribe({
            next: (res) => { this.config.set(res.data ?? {}); this.cdr.detectChanges(); },
            error: () => {}
        });

        this.redSocialService.getActivas().subscribe({
            next: (res) => {
                this.redesSociales.set((res.data ?? []).filter((r) => r.mostrar_footer));
                this.cdr.detectChanges();
            },
            error: () => {}
        });
    }

    get telefonoTexto(): string {
        return this.config().telefono?.trim() ?? '';
    }

    get telefonoHref(): string | null {
        return this.telefonoTexto ? `tel:${this.telefonoTexto.replace(/[^\d+]/g, '')}` : null;
    }

    get emailTexto(): string {
        return this.config().email_contacto?.trim() ?? '';
    }

    get emailHref(): string | null {
        return this.emailTexto ? `mailto:${this.emailTexto}` : null;
    }

    get direccionTexto(): string {
        const config = this.config();
        const direccion = config.direccion?.trim();
        if (direccion) return direccion;

        return [config.ciudad, config.pais]
            .map((value) => value?.trim())
            .filter(Boolean)
            .join(', ');
    }
}
