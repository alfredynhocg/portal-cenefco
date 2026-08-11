import { Component } from '@angular/core';

@Component({
  selector: 'app-cta',
  imports: [],
  templateUrl: './cta.component.html',
  styles: ``
})
export class CtaComponent {
  readonly waUrl = `https://wa.me/59160589189?text=${encodeURIComponent('Hola, me gustaría obtener información sobre los cursos del CENEFCO.')}`;
}
