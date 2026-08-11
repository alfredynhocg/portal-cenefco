import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Acreditacion } from '../../acreditaciones/domain/models/acreditacion.model';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-acreditacion-modal',
  standalone: true,
  imports: [CommonModule, ImageUrlPipe],
  templateUrl: './acreditacion-modal.component.html',
  styleUrls: ['./acreditacion-modal.component.scss'],
})
export class AcreditacionModalComponent {
  @Input() visible = false;
  @Output() readonly visibleChange = new EventEmitter<boolean>();
  @Input() acreditacion: Acreditacion | null = null;

  private cdr = inject(ChangeDetectorRef);

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cdr.detectChanges();
  }
}
