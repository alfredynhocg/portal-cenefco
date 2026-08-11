import {
  Component, Input, Output, EventEmitter, OnChanges, OnDestroy,
  SimpleChanges, PLATFORM_ID, inject, ChangeDetectorRef, signal
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, FormGroup, Validators,
  ValidatorFn, AbstractControl, ValidationErrors,
} from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormularioPortal, CampoFormularioPortal } from '../../domain/models/formulario-portal.model';
import { FormularioPortalService, CiBusquedaResult } from '../../application/services/formulario-portal.service';
import { CertModalComponent } from '../../../cert-inscripcion/presentation/cert-modal/cert-modal.component';
import { CertConfigService } from '../../../cert-inscripcion/application/services/cert-config.service';
import { CertConfigPortal } from '../../../cert-inscripcion/domain/models/cert-config.model';
import { resolverClaveRaiz } from '../../domain/services/campo-raiz-resolver';
import { CaptchaService, CaptchaResponse } from '../../../captcha/captcha.service';

const AUTOCOMPLETAR_MAP: Record<string, string[]> = {
  nombre:           ['nombre', 'nombre_completo', 'nombres'],
  apellido_paterno: ['apellido_paterno', 'paterno'],
  apellido_materno: ['apellido_materno', 'materno'],
  email:            ['email'],
  telefono:         ['telefono', 'celular'],
  ci:               ['ci', 'cedula'],
};

@Component({
  selector: 'app-formulario-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CertModalComponent],
  templateUrl: './formulario-modal.component.html',
  styleUrls: ['./formulario-modal.component.scss'],
})
export class FormularioModalComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Input() formulario: FormularioPortal | null = null;
  @Input() cargandoError = false;
  @Input() programaId: number | null = null;
  @Input() cursoNombre = '';
  @Input() urlWhatsapp: string | null = null;
  @Output() readonly visibleChange = new EventEmitter<boolean>();

  private svc        = inject(FormularioPortalService);
  private certSvc    = inject(CertConfigService);
  private captchaSvc = inject(CaptchaService);
  private fb         = inject(FormBuilder);
  private cdr        = inject(ChangeDetectorRef);
  private isBrowser  = isPlatformBrowser(inject(PLATFORM_ID));

  form: FormGroup = this.fb.group({});
  submitting      = signal(false);
  submitted       = signal(false);
  errorMsg        = signal<string | null>(null);
  autocompleted   = signal(false);
  yaInscrito      = signal(false);

  captcha        = signal<CaptchaResponse | null>(null);
  captchaLoading = signal(false);
  captchaValue   = signal('');

  certConfig         = signal<CertConfigPortal | null>(null);
  certModalVisible   = signal(false);
  certUsuarioCi      = signal('');
  certUsuarioNombre  = signal('');
  certUsuarioEmail   = signal<string | null>(null);
  certInscripcionId  = signal<number | null>(null);
  uploadingFields: Record<string, boolean> = {};
  fileUrls: Record<string, string> = {};

  private scrollY   = 0;
  private destroy$  = new Subject<void>();
  private ciInput$  = new Subject<string>();

  constructor() {
    this.ciInput$.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      switchMap((ci): import('rxjs').Observable<CiBusquedaResult | null> => {
        if (ci.length < 4) {
          this.autocompleted.set(false);
          this.yaInscrito.set(false);
          this.cdr.detectChanges();
          return of(null);
        }
        return this.svc.buscarPorCi(ci, this.programaId);
      }),
      takeUntil(this.destroy$),
    ).subscribe(result => {
      if (result) {
        this.yaInscrito.set(result.ya_inscrito);
        if (!result.ya_inscrito) {
          this.aplicarAutocompletado(result);
        }
      } else {
        this.autocompleted.set(false);
        this.yaInscrito.set(false);
      }
      this.cdr.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.isBrowser) {
      if (this.visible) {
        this.scrollY = window.scrollY;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollY}px`;
        document.body.style.width = '100%';
        this.resetForm();
      } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, this.scrollY);
      }
      this.cdr.detectChanges();
    }
    if (changes['formulario'] && this.formulario) {
      this.resetForm();
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  private resetForm(): void {
    if (!this.formulario) return;
    const controls: Record<string, unknown[]> = {};
    for (const campo of this.formulario.campos) {
      if (campo.tipo === 'checkbox') {
        controls[campo.nombre_campo] = [false, campo.requerido ? [Validators.requiredTrue] : []];
      } else if (campo.tipo === 'file') {
        controls[campo.nombre_campo] = [null, campo.requerido ? [Validators.required] : []];
      } else {
        controls[campo.nombre_campo] = ['', this.validadoresParaCampo(campo)];
      }
    }
    this.form = this.fb.group(controls);
    this.submitted.set(false);
    this.errorMsg.set(null);
    this.autocompleted.set(false);
    this.yaInscrito.set(false);
    this.fileUrls = {};
    this.uploadingFields = {};
    this.loadCaptcha();
    this.cdr.detectChanges();
  }

  loadCaptcha(): void {
    this.captchaLoading.set(true);
    this.captchaValue.set('');
    this.captchaSvc.generate().subscribe({
      next: (res) => { this.captcha.set(res); this.captchaLoading.set(false); this.cdr.detectChanges(); },
      error: () => { this.captchaLoading.set(false); this.cdr.detectChanges(); },
    });
  }

  private validadoresParaCampo(campo: CampoFormularioPortal): ValidatorFn[] {
    const validadores: ValidatorFn[] = [];
    if (campo.requerido) validadores.push(Validators.required);

    switch (campo.tipo) {
      case 'email':
        validadores.push(Validators.email);
        break;
      case 'number':
        if (campo.validacion?.min != null) validadores.push(Validators.min(campo.validacion.min));
        if (campo.validacion?.max != null) validadores.push(Validators.max(campo.validacion.max));
        break;
      case 'select':
        if (campo.opciones?.length) {
          validadores.push(this.validadorOpciones(campo.opciones));
        }
        break;
      case 'text':
      case 'textarea':
      case 'tel':
        if (campo.validacion?.min_length != null) validadores.push(Validators.minLength(campo.validacion.min_length));
        if (campo.validacion?.max_length != null) validadores.push(Validators.maxLength(campo.validacion.max_length));
        if (campo.validacion?.patron) validadores.push(Validators.pattern(campo.validacion.patron));
        break;
    }

    return validadores;
  }

  private validadorOpciones(opciones: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return opciones.includes(control.value) ? null : { opcionInvalida: true };
    };
  }

  mensajeError(campo: CampoFormularioPortal): string | null {
    const ctrl = this.form.get(campo.nombre_campo);
    if (!ctrl || !ctrl.errors || !ctrl.touched) return null;

    if (ctrl.errors['required'] || ctrl.errors['requiredTrue']) return 'Este campo es requerido.';
    if (ctrl.errors['email']) return 'Ingresa un correo electrónico válido.';
    if (ctrl.errors['min']) return `El valor mínimo permitido es ${ctrl.errors['min'].min}.`;
    if (ctrl.errors['max']) return `El valor máximo permitido es ${ctrl.errors['max'].max}.`;
    if (ctrl.errors['minlength']) return `Debe tener al menos ${ctrl.errors['minlength'].requiredLength} caracteres.`;
    if (ctrl.errors['maxlength']) return `No puede superar los ${ctrl.errors['maxlength'].requiredLength} caracteres.`;
    if (ctrl.errors['pattern']) return 'El formato ingresado no es válido.';
    if (ctrl.errors['opcionInvalida']) return 'Selecciona una opción válida de la lista.';
    return 'Este campo no es válido.';
  }

  esCampoCi(campo: CampoFormularioPortal): boolean {
    return resolverClaveRaiz(campo.nombre_campo) === 'ci';
  }

  onCiInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value.trim();
    this.ciInput$.next(val);
  }

  private aplicarAutocompletado(result: CiBusquedaResult): void {
    if (!this.formulario) return;

    let alguno = false;
    for (const [claveBackend, camposPosibles] of Object.entries(AUTOCOMPLETAR_MAP)) {
      const valor = (result as unknown as Record<string, string | null>)[claveBackend];
      if (!valor) continue;

      for (const nombreCampo of camposPosibles) {
        const ctrl = this.form.get(nombreCampo);
        if (ctrl && !ctrl.value) {
          ctrl.setValue(valor);
          alguno = true;
          break;
        }
      }
    }
    if (alguno) this.autocompleted.set(true);
  }

  onFileChange(event: Event, campo: CampoFormularioPortal): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.uploadingFields[campo.nombre_campo] = true;
    this.cdr.detectChanges();
    this.svc.uploadFile(file).subscribe({
      next: (res) => {
        this.fileUrls[campo.nombre_campo] = res.url;
        this.form.get(campo.nombre_campo)?.setValue(res.url);
        this.uploadingFields[campo.nombre_campo] = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.uploadingFields[campo.nombre_campo] = false;
        this.errorMsg.set('No se pudo subir el archivo. Intente de nuevo.');
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.yaInscrito()) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); this.cdr.detectChanges(); return; }
    if (!this.captchaValue().trim()) { this.errorMsg.set('Ingrese el código de verificación.'); this.cdr.detectChanges(); return; }
    if (this.submitting()) return;

    const valores = this.form.getRawValue();
    const documentos: Record<string, string> = {};
    const camposExtra: Record<string, unknown> = {};

    const payload: Record<string, unknown> = {
      programa_id:    this.programaId,
      origen:         'portal',
      captcha_key:    this.captcha()?.key,
      captcha_value:  this.captchaValue(),
    };

    for (const campo of (this.formulario?.campos ?? [])) {
      const valor = valores[campo.nombre_campo];

      if (campo.tipo === 'file') {
        if (this.fileUrls[campo.nombre_campo]) {
          documentos[campo.nombre_campo] = this.fileUrls[campo.nombre_campo];
        }
        continue;
      }

      const claveRaiz = resolverClaveRaiz(campo.nombre_campo);

      if (claveRaiz) {
        if (!(claveRaiz in payload)) {
          payload[claveRaiz] = valor;
        } else if (claveRaiz === 'telefono' && !payload['telefono']) {
          payload['telefono'] = valor;
        }
      } else {
        camposExtra[campo.nombre_campo] = valor;
      }
    }

    if (Object.keys(documentos).length)  payload['documentos']   = documentos;
    if (Object.keys(camposExtra).length) payload['campos_extra'] = camposExtra;

    this.submitting.set(true);
    this.errorMsg.set(null);

    this.svc.submitInscripcion(payload).subscribe({
      next: (res) => {
        this.submitted.set(true);
        this.submitting.set(false);
        this.certUsuarioCi.set((payload['ci'] as string) ?? '');
        this.certUsuarioNombre.set((payload['nombre'] as string) ?? '');
        this.certUsuarioEmail.set((payload['email'] as string) ?? null);
        this.certInscripcionId.set(res?.inscripcion_id ?? null);
        if (this.programaId) {
          this.certSvc.getConfig(this.programaId).subscribe({
            next: (cfg) => {
              if (cfg?.activo) {
                this.certConfig.set(cfg);
                this.certModalVisible.set(true);
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
              }
              this.cdr.detectChanges();
            },
            error: () => this.cdr.detectChanges(),
          });
        } else {
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        if (err?.status === 409) {
          this.yaInscrito.set(true);
          this.submitting.set(false);
          this.cdr.detectChanges();
          return;
        }
        const msgs: string[] = err?.error?.errors
          ? Object.values(err.error.errors).flat() as string[]
          : [err?.error?.message ?? 'No se pudo completar la inscripción. Inténtelo de nuevo.'];
        this.errorMsg.set(msgs.join(' '));
        this.submitting.set(false);
        this.loadCaptcha();
        this.cdr.detectChanges();
      }
    });
  }

  onCertModalClosed(): void {
    this.certModalVisible.set(false);
    this.cdr.detectChanges();
  }

  get campos(): CampoFormularioPortal[] {
    return this.formulario?.campos ?? [];
  }

  isUploading(): boolean {
    return Object.values(this.uploadingFields).some(v => v);
  }
}
