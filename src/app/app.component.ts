import { Component, PLATFORM_ID, inject, type OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { ScrollToTopComponent } from "./components/scroll-to-top/scroll-to-top.component";
import { AnalyticsService } from './analytics/application/services/analytics.service';
import { EfectoEspecialComponent } from './efectos-especiales/presentation/efecto-especial/efecto-especial.component';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ScrollToTopComponent, EfectoEspecialComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    private titleService      = inject(Title)
    private router            = inject(Router)
    private activatedRoute    = inject(ActivatedRoute)
    private analyticsService  = inject(AnalyticsService)
    private isBrowser         = isPlatformBrowser(inject(PLATFORM_ID))

    ngOnInit(): void {
        if (this.isBrowser) {
            import('aos').then(({ default: aos }) => aos.init());
        }
        this.analyticsService.init();
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => {
                    let route = this.activatedRoute;
                    while (route.firstChild) {
                        route = route.firstChild;
                    }
                    return route;
                }),
                mergeMap(route => route.data)
            )
            .subscribe(data => {
                if (data['title']) {
                    this.titleService.setTitle(data['title'] +
                        ' | CENEFCO');
                }
            });
    }
}
