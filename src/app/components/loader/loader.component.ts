import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

const LOGOS = [
    'assets/img/logo/cenefco/cenefco-logo.png',
    'assets/img/logo/cenefco/azul.png',
    'assets/img/logo/cenefco/naranja.png',
    'assets/img/logo/cenefco/rosado.png',
    'assets/img/logo/cenefco/mostasa.png',
    'assets/img/logo/cenefco/verde.png',
];

@Component({
    selector: 'app-loader',
    imports: [],
    templateUrl: './loader.component.html',
    styles: ``
})
export class LoaderComponent implements OnInit, OnDestroy {
    private router = inject(Router);

    visible = signal(true);
    logo = LOGOS[Math.floor(Math.random() * LOGOS.length)];

    private hideTimer?: ReturnType<typeof setTimeout>;
    private routerSub?: Subscription;

    ngOnInit(): void {
        this.hideTimer = setTimeout(() => this.visible.set(false), 600);

        this.routerSub = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.logo = LOGOS[Math.floor(Math.random() * LOGOS.length)];
                this.visible.set(true);
            } else if (event instanceof NavigationEnd) {
                clearTimeout(this.hideTimer);
                this.hideTimer = setTimeout(() => this.visible.set(false), 400);
            }
        });
    }

    ngOnDestroy(): void {
        clearTimeout(this.hideTimer);
        this.routerSub?.unsubscribe();
    }
}
