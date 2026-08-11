import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from '../../../menus/domain/models/menu.model';

@Component({
  selector: 'app-mobile-nav-item',
  imports: [CommonModule, RouterLink],
  templateUrl: './mobile-nav-item.component.html',
  styles: ``
})
export class MobileNavItemComponent {
    @Input() item!: MenuItem & { isOpen?: boolean };
    @Output() cerrarMenu = new EventEmitter<void>();

    toggleSubMenu(item: MenuItem & { isOpen?: boolean }, event?: Event) {
        if (event) event.stopPropagation();
        item.isOpen = !item.isOpen;
    }

    onLinkClick(): void {
        this.cerrarMenu.emit();
    }

    isExternal(url: string | null): boolean {
        return !!url && (url.startsWith('http://') || url.startsWith('https://'));
    }
}
