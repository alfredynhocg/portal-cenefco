import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "@app/components/footer/footer.component";
import { LoaderComponent } from "@app/components/loader/loader.component";
import { ScrollToTopComponent } from "@app/components/scroll-to-top/scroll-to-top.component";
import { CtaComponent } from "../components/cta/cta.component";
import { TopbarComponent } from '@app/components/topbar/topbar.component';
import { PopupDisplayComponent } from '../../popups/popup-display/popup-display.component';
import { WhatsappButtonComponent } from '../../components/whatsapp-button/whatsapp-button.component';
import { ConfiguracionService } from '../../configuracion/application/services/configuracion.service';

@Component({
    selector: 'app-layout',
    imports: [LoaderComponent, ScrollToTopComponent, TopbarComponent, RouterOutlet, FooterComponent, CtaComponent, PopupDisplayComponent, WhatsappButtonComponent],
    templateUrl: './layout.component.html',
    styles: ``
})
export class LayoutComponent implements OnInit {
    private configuracionService = inject(ConfiguracionService);

    whatsappNumero  = signal<string>('');
    whatsappMensaje = signal<string>('Hola, quiero información sobre sus programas.');

    ngOnInit(): void {
        this.configuracionService.getPublica().subscribe({
            next: res => {
                if (res?.data?.whatsapp_numero) {
                    this.whatsappNumero.set(res.data.whatsapp_numero);
                }
                if (res?.data?.whatsapp_mensaje) {
                    this.whatsappMensaje.set(res.data.whatsapp_mensaje);
                }
            },
        });
    }
}
