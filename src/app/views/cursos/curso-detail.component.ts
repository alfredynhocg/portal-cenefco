import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation, inject, signal } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { CursoService } from '../../cursos/application/services/curso.service';
import { Curso } from '../../cursos/domain/models/curso.model';
import { VideoModalComponent } from '../../components/video-modal/video-modal.component';
import { GaleriaModalComponent } from '../../components/galeria-modal/galeria-modal.component';
import { CursoResenasComponent } from '../../components/curso-resenas/curso-resenas.component';
import { PagoModalComponent } from '../../components/pago-modal/pago-modal.component';
import { CarritoService } from '../../carrito/application/services/carrito.service';
import { FormularioModalComponent } from '../../formularios/presentation/formulario-modal/formulario-modal.component';
import { FormularioPortalService } from '../../formularios/application/services/formulario-portal.service';
import { FormularioPortal } from '../../formularios/domain/models/formulario-portal.model';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';

@Component({
    selector: 'app-curso-detail',
    imports: [CommonModule, RouterLink, BreadcrumbComponent, FormularioModalComponent, VideoModalComponent, GaleriaModalComponent, CursoResenasComponent, PagoModalComponent],
    providers: [ImageUrlPipe],
    templateUrl: './curso-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./curso-detail.component.scss'],
})
export class CursoDetailComponent implements OnInit, OnDestroy {

    private route              = inject(ActivatedRoute);
    private cursoService       = inject(CursoService);
    private cdr                = inject(ChangeDetectorRef);
    private formularioSvc      = inject(FormularioPortalService);
    private document           = inject<Document>(DOCUMENT);
    private meta                = inject(Meta);
    private titleService        = inject(Title);
    private imageUrlPipe        = inject(ImageUrlPipe);
    private isBrowser           = isPlatformBrowser(inject(PLATFORM_ID));
    readonly carritoService    = inject(CarritoService);

    curso: Curso | null = null;
    formulario = signal<FormularioPortal | null>(null);
    formularioCargando = signal(false);
    formularioError = signal(false);
    activeTab = 'descripcion';
    pageUrl = '';
    modalVisible = false;
    videoModalVisible = false;
    galeriaModalVisible = false;
    galeriaIndiceInicial = 0;
    pagoModalVisible = false;

    @ViewChild('galeriaTrack') galeriaTrack?: ElementRef<HTMLDivElement>;
    galeriaDotActivo = signal(0);
    private galeriaAutoPlayTimer?: ReturnType<typeof setInterval>;
    private galeriaPauseTimer?: ReturnType<typeof setTimeout>;
    private readonly GALERIA_INTERVAL = 3500;

    private sub: Subscription | null = null;

    ngOnInit(): void {
        this.pageUrl = this.document.location.href;
        this.sub = this.route.paramMap.pipe(
            switchMap(params => {
                this.curso = null;
                this.activeTab = 'descripcion';
                this.formulario.set(null);
                this.detenerGaleriaAutoPlay();
                this.cdr.detectChanges();
                return this.cursoService.getBySlug(params.get('slug') ?? '');
            })
        ).subscribe({
            next: (curso) => {
                this.curso = curso;
                this.pageUrl = this.document.location.href;
                this.setMetaTags(curso);
                this.galeriaDotActivo.set(0);
                this.cdr.detectChanges();
                if (this.isBrowser) setTimeout(() => this.iniciarGaleriaAutoPlay(), 0);
            }
        });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
        this.detenerGaleriaAutoPlay();
        this.meta.removeTag("property='og:title'");
        this.meta.removeTag("property='og:description'");
        this.meta.removeTag("property='og:image'");
        this.meta.removeTag("property='og:url'");
        this.meta.removeTag("property='og:type'");
        this.meta.removeTag("name='twitter:card'");
        this.meta.removeTag("name='twitter:title'");
        this.meta.removeTag("name='twitter:description'");
        this.meta.removeTag("name='twitter:image'");
    }

    private setMetaTags(curso: Curso): void {
        const url = this.document.location.href;
        const titulo = curso.nombre_programa;
        const descripcion = curso.descripcion ?? titulo;
        const imagen = this.imageUrlPipe.transform(curso.imagen_banner_url ?? curso.foto) ?? '';

        this.titleService.setTitle(`${titulo} | CENEFCO`);

        this.meta.updateTag({ property: 'og:type',        content: 'website' });
        this.meta.updateTag({ property: 'og:title',       content: titulo });
        this.meta.updateTag({ property: 'og:description', content: descripcion });
        this.meta.updateTag({ property: 'og:url',         content: url });
        this.meta.updateTag({ property: 'og:image',       content: imagen });

        this.meta.updateTag({ name: 'twitter:card',        content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title',       content: titulo });
        this.meta.updateTag({ name: 'twitter:description', content: descripcion });
        this.meta.updateTag({ name: 'twitter:image',       content: imagen });
    }

    get inscripcionEstado(): 'abiertas' | 'proximas' | 'cerradas' {
        if (!this.curso?.inicio_inscripciones) return 'proximas';
        const hoy = new Date();
        const inicio = new Date(this.curso.inicio_inscripciones);
        const fin = this.curso.inicio_actividades ? new Date(this.curso.inicio_actividades) : null;
        if (hoy < inicio) return 'proximas';
        if (fin && hoy > fin) return 'cerradas';
        return 'abiertas';
    }

    get fechaLimiteInscripcion(): string | null {
        return this.curso?.inicio_actividades
            ?? this.curso?.inicio_inscripciones
            ?? null;
    }

    get diasRestantes(): number | null {
        const fecha = this.fechaLimiteInscripcion;
        if (!fecha) return null;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const limite = new Date(fecha);
        limite.setHours(0, 0, 0, 0);
        return Math.ceil((limite.getTime() - hoy.getTime()) / 86400000);
    }

    get labelDias(): string {
        const d = this.diasRestantes;
        if (d === null) return '';
        if (d < 0)  return 'Inscripciones cerradas';
        if (d === 0) return '¡Último día!';
        if (d === 1) return 'Falta 1 día';
        return `Faltan ${d} días`;
    }

    get colorDias(): 'green' | 'orange' | 'red' {
        const d = this.diasRestantes;
        if (d === null || d < 0) return 'red';
        if (d <= 5) return 'orange';
        return 'green';
    }

    abrirModal(): void {
        this.modalVisible = true;
        this.cdr.detectChanges();

        if (this.formulario() || !this.curso?.formulario_id) return;

        this.formularioCargando.set(true);
        this.formularioError.set(false);
        this.formularioSvc.getById(this.curso.formulario_id).subscribe({
            next: (f) => {
                this.formulario.set(f);
                this.formularioCargando.set(false);
                this.cdr.detectChanges();
            },
            error: () => {
                this.formularioCargando.set(false);
                this.formularioError.set(true);
                this.cdr.detectChanges();
            },
        });
    }

    abrirPagoModal(): void {
        this.pagoModalVisible = true;
        this.cdr.detectChanges();
    }

    agregarAlCarrito(): void {
        if (this.curso) {
            this.carritoService.agregar(this.curso);
            this.cdr.detectChanges();
        }
    }

    get enCarrito(): boolean {
        return this.curso ? this.carritoService.estaEnCarrito(this.curso.id_programa) : false;
    }

    readonly PAGOS_HABILITADOS = false;

    get tienePrecio(): boolean {
        return !!(this.curso?.plan_costo || this.curso?.inversion);
    }

    cerrarPagoModal(): void {
        this.pagoModalVisible = false;
        this.cdr.detectChanges();
    }

    abrirVideoModal(): void {
        this.videoModalVisible = true;
        this.cdr.detectChanges();
    }

    abrirGaleriaModal(indice = 0): void {
        this.galeriaIndiceInicial = indice;
        this.galeriaModalVisible = true;
        this.cdr.detectChanges();
    }

    private iniciarGaleriaAutoPlay(): void {
        this.detenerGaleriaAutoPlay();
        const total = this.curso?.imagenes?.length ?? 0;
        if (total <= 1) return;
        this.galeriaAutoPlayTimer = setInterval(() => this.galeriaAvanzarSiguiente(), this.GALERIA_INTERVAL);
    }

    private detenerGaleriaAutoPlay(): void {
        if (this.galeriaAutoPlayTimer) clearInterval(this.galeriaAutoPlayTimer);
        if (this.galeriaPauseTimer)    clearTimeout(this.galeriaPauseTimer);
    }

    private galeriaAvanzarSiguiente(): void {
        const total = this.curso?.imagenes?.length ?? 0;
        if (!total || !this.galeriaTrack) return;
        const siguiente = (this.galeriaDotActivo() + 1) % total;
        this.galeriaIrADot(siguiente);
    }

    galeriaScrollPrev(): void {
        this.galeriaPausarYReanudar();
        this.galeriaTrack?.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }

    galeriaScrollNext(): void {
        this.galeriaPausarYReanudar();
        this.galeriaTrack?.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }

    galeriaIrADot(index: number): void {
        const track = this.galeriaTrack?.nativeElement;
        if (!track) return;
        const item = track.children[index] as HTMLElement;
        if (item) {
            track.scrollTo({ left: item.offsetLeft - track.offsetLeft, behavior: 'smooth' });
        }
        this.galeriaDotActivo.set(index);
    }

    galeriaOnScroll(): void {
        const track = this.galeriaTrack?.nativeElement;
        const total = this.curso?.imagenes?.length ?? 0;
        if (!track || !total) return;
        const itemW = (track.children[0] as HTMLElement)?.offsetWidth ?? 1;
        const index = Math.round(track.scrollLeft / itemW);
        this.galeriaDotActivo.set(Math.min(index, total - 1));
        this.cdr.detectChanges();
    }

    galeriaOnTouchStart(): void {
        this.galeriaPausarYReanudar();
    }

    private galeriaPausarYReanudar(): void {
        this.detenerGaleriaAutoPlay();
        this.galeriaPauseTimer = setTimeout(() => this.iniciarGaleriaAutoPlay(), 6000);
    }

    shareUrl(red: 'facebook' | 'linkedin' | 'whatsapp'): string {
        const url = encodeURIComponent(this.pageUrl);
        const titulo = encodeURIComponent(this.curso?.nombre_programa ?? '');
        if (red === 'facebook') return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        if (red === 'linkedin') return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        return `https://wa.me/?text=${titulo}%20${url}`;
    }
}
