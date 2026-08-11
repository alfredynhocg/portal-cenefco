import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="cd-resultado-pago cd-resultado-pago--exitoso">
      <div class="cd-resultado-pago__icon">✓</div>
      <h1 class="cd-resultado-pago__titulo">¡Pago confirmado!</h1>
      <p class="cd-resultado-pago__texto">
        Tu inscripción fue registrada exitosamente. En breve recibirás un correo
        con los detalles y tu comprobante de pago.
      </p>
      <div class="cd-resultado-pago__acciones">
        @if (idIns) {
          <a [href]="'/api/v1/ventas/' + idIns + '/pdf'" target="_blank" class="cd-btn cd-btn--secondary">
            Descargar comprobante PDF
          </a>
        }
        <a routerLink="/cursos" class="cd-btn cd-btn--primary">Ver más cursos</a>
      </div>
    </div>
  `,
})
export class PagoExitosoComponent {
  private route = inject(ActivatedRoute);

  readonly idIns: number | null = Number(this.route.snapshot.queryParamMap.get('id_ins')) || null;
}
