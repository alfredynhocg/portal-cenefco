import { Component } from '@angular/core';
import { ServiceCardComponent } from "@app/components/cards/service-card/service-card.component";
import type { ServiceType } from '@/types';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-view-services',
    imports: [ServiceCardComponent,CommonModule],
    templateUrl: './view-services.component.html',
    styles: ``
})
export class ViewServicesComponent {
    services: ServiceType[] = [
        {
            id: 1,
            image: 'assets/img/all-images/header_default_cenefco.jpg',
            title: 'Bright Spark Services',
            description: 'Explore our range of services below & discover how you power your life'
        },
        {
            id: 2,
            image: 'assets/img/all-images/header_default_cenefco.jpg',
            title: 'Energy Ease Packages',
            description: 'With cutting-edge technology & industry expertise, we empower'
        },
        {
            id: 3,
            image: 'assets/img/all-images/header_default_cenefco.jpg',
            title: 'Electra Care Packages',
            description: 'Our team of experts is committed to delivering high-quality services'
        }
    ];
}
