import { Component } from '@angular/core';
import { LatestBulletinsComponent } from "./components/latest-bulletins/latest-bulletins.component";
import { PartnerInstitutionsComponent } from "./components/partner-institutions/partner-institutions.component";
import { ContactComponent } from "./components/contact/contact.component";
import { FaqsComponent } from "./components/faqs/faqs.component";
import { HeroComponent } from "./components/hero/hero.component";
import { FeaturedCoursesComponent } from "./components/featured-courses/featured-courses.component";
import { PhotoGalleryComponent } from "./components/photo-gallery/photo-gallery.component";
import { TestimonialComponent } from "./components/testimonial/testimonial.component";
import { VirtualAssistantComponent } from "./components/virtual-assistant/virtual-assistant.component";
import { AreasHomeComponent } from "./components/areas/areas.component";
import { EquipoDirectivoComponent } from "./components/equipo-directivo/equipo-directivo.component";
import { MisionVisionComponent } from "./components/mision-vision/mision-vision.component";
import { TriviaBannerComponent } from "./components/trivia-banner/trivia-banner.component";

@Component({
    selector: 'app-home-1',
    imports: [HeroComponent, AreasHomeComponent, EquipoDirectivoComponent, MisionVisionComponent, TriviaBannerComponent, FeaturedCoursesComponent, VirtualAssistantComponent, TestimonialComponent, PhotoGalleryComponent, FaqsComponent, ContactComponent, PartnerInstitutionsComponent, LatestBulletinsComponent],
    templateUrl: './home-1.component.html',
    styles: ``
})
export class Home1Component {}
