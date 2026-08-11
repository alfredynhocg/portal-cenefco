import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  imports: [],
  templateUrl: './whatsapp-button.component.html',
  styles: ``
})
export class WhatsappButtonComponent {
  @Input() phone: string = '15551941010';
  @Input() message: string = 'Hola, necesito información sobre el CENEFCO.';

  get waUrl(): string {
    return `https://wa.me/${this.phone}?text=${encodeURIComponent(this.message)}`;
  }
}
