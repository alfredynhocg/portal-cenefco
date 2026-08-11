import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AutoridadService } from '../../../../autoridades/application/services/autoridad.service';
import { Autoridad } from '../../../../autoridades/domain/models/autoridad.model';
import { INSTITUCIONAL } from '../../../../core/constants/institucional.constants';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-about',
  imports: [RouterLink, CommonModule, ImageUrlPipe],
  templateUrl: './autoridad.component.html',
  styles: ``
})
export class AutoridadComponent implements OnInit {
  private autoridadService = inject(AutoridadService);

  readonly institucional = INSTITUCIONAL;
  alcalde: Autoridad | null = null;

  ngOnInit(): void {
    this.autoridadService.getByTipo('alcalde').subscribe({
      next: (res) => { this.alcalde = res; },
      error: () => { this.alcalde = null; }
    });
  }
}
