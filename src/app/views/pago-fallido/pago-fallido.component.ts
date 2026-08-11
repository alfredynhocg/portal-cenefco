import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pago-fallido',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="cd-resultado-pago cd-resultado-pago--fallido">
      <div class="cd-resultado-pago__icon">✕</div>
      <h1 class="cd-resultado-pago__titulo">El pago no pudo completarse</h1>
      <p class="cd-resultado-pago__texto">
        Hubo un problema al procesar tu pago. Puedes intentarlo nuevamente
        o contactarnos para recibir asistencia.
      </p>
      <div class="cd-resultado-pago__acciones">
        <a routerLink="/cursos" class="cd-btn cd-btn--primary">Volver a cursos</a>
        <a [href]="whatsappUrl" target="_blank" class="cd-btn cd-btn--outline">Contactar asesor</a>
      </div>
    </div>
  `,
})
export class PagoFallidoComponent {
  readonly whatsappUrl = 'https://wa.me/59160589189?text=Hola%2C+tuve+un+problema+con+mi+pago+en+CENEFCO';
}
