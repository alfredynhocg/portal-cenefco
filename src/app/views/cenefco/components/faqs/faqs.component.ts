import { Component, inject, signal, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { PreguntaFrecuenteService } from '../../../../preguntas-frecuentes/application/services/pregunta-frecuente.service';
import { PreguntaFrecuente } from '../../../../preguntas-frecuentes/domain/models/pregunta-frecuente.model';
import { FAQS } from '../../../../core/constants/faqs.constants';

@Component({
  selector: 'app-faqs',
  imports: [NgbAccordionModule],
  templateUrl: './faqs.component.html',
  styles: ``
})
export class FaqsComponent implements OnInit {
  private service = inject(PreguntaFrecuenteService);

  readonly ui = FAQS;
  faqs = signal<PreguntaFrecuente[]>([]);

  ngOnInit(): void {
    this.service.getAll(6).subscribe({
      next: (res) => this.faqs.set(res.data),
    });
  }
}
