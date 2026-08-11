import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { StickyScrollDirective } from '@core/directives/sticky-scroll.directive';
import { MobileMenuComponent } from "../mobile-menu/mobile-menu.component";
import { RouterLink } from '@angular/router';
import { MenuService } from '../../menus/application/services/menu.service';
import { MenuItem } from '../../menus/domain/models/menu.model';
import { CarritoService } from '../../carrito/application/services/carrito.service';
import { AuthService } from '../../auth/application/services/auth.service';

@Component({
    selector: 'app-topbar',
    imports: [MobileMenuComponent, CommonModule, StickyScrollDirective, RouterLink],
    templateUrl: './topbar.component.html',
    styles: ``
})
export class TopbarComponent implements OnInit {
    private menuService = inject(MenuService);
    private cdr = inject(ChangeDetectorRef);
    private authService = inject(AuthService);
    readonly carrito = inject(CarritoService);

    @Input() headerClass!: string;
    @Input() mobileHeaderClass!: string;
    @Input() mobileSidebarClass!: string;
    @Input() mobileLogo!: string;
    @Input() btnClass!: string;
    @Input() logo!: string;
    @Input() isAlert?: boolean;

    readonly PAGOS_HABILITADOS = false;

    menuItems: MenuItem[] = [];

    ngOnInit(): void {
        this.menuService.getMenuItems('menu-principal').subscribe({
            next: (items: MenuItem[]) => {
                this.menuItems = items;
                this.cdr.detectChanges();
            },
            error: () => {}
        });
    }

    isExternal(url: string | null): boolean {
        return !!url && (url.startsWith('http://') || url.startsWith('https://'));
    }

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }
}
