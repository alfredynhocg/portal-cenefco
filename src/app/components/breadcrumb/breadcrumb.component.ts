import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-breadcrumb',
    imports: [RouterLink],
    templateUrl: './breadcrumb.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
        .bc-nav {
            display: inline-flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0;
            background: rgba(255,255,255,0.10);
            backdrop-filter: blur(6px);
            border: 1px solid rgba(255,255,255,0.18);
            border-radius: 30px;
            padding: 7px 18px;
        }
        .bc-item {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 600;
            color: rgba(255,255,255,0.70);
            text-decoration: none;
            transition: color .2s;
            white-space: nowrap;
        }
        .bc-item:hover { color: #fff; }
        .bc-item i { font-size: 10px; color: #FC8900; }
        .bc-item.bc-home i.fa-house { color: rgba(255,255,255,0.70); font-size: 12px; }
        .bc-sep {
            font-size: 10px;
            color: rgba(255,255,255,0.35);
            margin: 0 6px;
        }
        .bc-current {
            font-size: 13px;
            font-weight: 700;
            color: #fff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 260px;
        }
        @media (max-width: 575px) {
            .bc-current { max-width: 160px; }
            .bc-nav { padding: 6px 14px; }
        }
    `]
})
export class BreadcrumbComponent {
    @Input() title!: string
    @Input() subTitle?: string
}
