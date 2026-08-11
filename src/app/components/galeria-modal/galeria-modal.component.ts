import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-galeria-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria-modal.component.html',
  styleUrls: ['./galeria-modal.component.scss'],
})
export class GaleriaModalComponent implements OnChanges {
  @Input() visible = false;
  @Output() readonly visibleChange = new EventEmitter<boolean>();
  @Input() cursoNombre = '';
  @Input() imagenes: string[] = [];
  @Input() indiceInicial = 0;

  private cdr = inject(ChangeDetectorRef);

  indiceActivo = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      this.indiceActivo = this.indiceInicial;
    }
  }

  get imagenActiva(): string {
    return this.imagenes[this.indiceActivo] ?? '';
  }

  seleccionar(i: number): void {
    this.indiceActivo = i;
    this.cdr.detectChanges();
  }

  anterior(): void {
    this.indiceActivo = this.indiceActivo > 0
      ? this.indiceActivo - 1
      : this.imagenes.length - 1;
    this.cdr.detectChanges();
  }

  siguiente(): void {
    this.indiceActivo = this.indiceActivo < this.imagenes.length - 1
      ? this.indiceActivo + 1
      : 0;
    this.cdr.detectChanges();
  }

  cerrar(): void {
    this.visible = false;
    this.indiceActivo = 0;
    this.visibleChange.emit(false);
    this.cdr.detectChanges();
  }
}
