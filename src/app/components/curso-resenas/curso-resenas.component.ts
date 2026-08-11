import { Component, Input, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResenaService, Resena } from '../../cursos/application/services/resena.service';

@Component({
  selector: 'app-curso-resenas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './curso-resenas.component.html',
  styleUrls: ['./curso-resenas.component.scss'],
})
export class CursoResenasComponent implements OnChanges {
  @Input() programaId: number | null = null;

  private svc = inject(ResenaService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  resenas: Resena[] = [];
  cargando = false;
  enviando = false;
  enviado = false;
  errorMsg = '';
  estrellaHover = 0;

  form = this.fb.group({
    nombre:       ['', [Validators.required, Validators.maxLength(200)]],
    cargo_actual: ['', Validators.maxLength(200)],
    calificacion: [0, [Validators.required, Validators.min(1)]],
    titulo_resena:['', Validators.maxLength(300)],
    resena:       ['', [Validators.required, Validators.maxLength(2000)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['programaId']?.currentValue) {
      this.cargarResenas();
    }
  }

  cargarResenas(): void {
    if (!this.programaId) return;
    this.cargando = true;
    this.svc.getByPrograma(this.programaId).subscribe({
      next: res => { this.resenas = res.data; this.cargando = false; this.cdr.detectChanges(); },
      error: () => { this.cargando = false; this.cdr.detectChanges(); },
    });
  }

  setEstrella(n: number): void {
    this.form.patchValue({ calificacion: n });
    this.cdr.detectChanges();
  }

  estrellas(n: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < n);
  }

  get calificacionActual(): number {
    return this.form.get('calificacion')?.value ?? 0;
  }

  onSubmit(): void {
    if (this.form.invalid || !this.programaId) { this.form.markAllAsTouched(); return; }
    const raw = this.form.getRawValue();
    this.enviando = true;
    this.errorMsg = '';
    this.svc.create({
      programa_id:   this.programaId,
      nombre:        raw.nombre!,
      cargo_actual:  raw.cargo_actual || undefined,
      calificacion:  raw.calificacion!,
      titulo_resena: raw.titulo_resena || undefined,
      resena:        raw.resena!,
    }).subscribe({
      next: () => {
        this.enviado = true;
        this.enviando = false;
        this.form.reset();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMsg = 'Ocurrió un error al enviar tu reseña. Inténtalo de nuevo.';
        this.enviando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
