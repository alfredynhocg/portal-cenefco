import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MobileNavItemComponent } from "./mobile-nav-item/mobile-nav-item.component";
import { RouterLink } from '@angular/router';
import { MenuItem } from '../../menus/domain/models/menu.model';
import { AuthService } from '../../auth/application/services/auth.service';

@Component({
    selector: 'app-mobile-menu',
    imports: [CommonModule, MobileNavItemComponent, RouterLink],
    templateUrl: './mobile-menu.component.html',
    styles: ``
})
export class MobileMenuComponent {
    private authService = inject(AuthService);

    isMenuOpen = false;

    @Input() mobileHeaderClass!: string;
    @Input() mobileSidebarClass!: string;
    @Input() mobileLogo!: string;
    @Input() btnClass!: string;
    @Input() menuItems: MenuItem[] = [];

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    closeMenu() {
        this.isMenuOpen = false;
    }
}
