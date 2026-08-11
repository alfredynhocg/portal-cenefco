import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { CalendarioAcademicoService } from '../../calendario-academico/application/services/calendario-academico.service';
import { CalendarioAcademico } from '../../calendario-academico/domain/models/calendario-academico.model';
import { CALENDARIO_ACADEMICO, TIPOS_EVENTO } from '@core/constants/calendario-academico.constance';

interface DiaGrid { fecha: Date; otroMes: boolean; esHoy: boolean; }
type PosEvento = 'unico' | 'inicio' | 'medio' | 'fin';

const DIAS  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

@Component({
    selector: 'app-calendario-academico',
    imports: [BreadcrumbComponent],
    templateUrl: './calendario-academico.component.html',
    styles: [`
        :host ::ng-deep .hero1-section-area.about-bg-area {
            padding-top: 150px !important;
            padding-bottom: 80px !important;
            min-height: unset !important;
            height: auto !important;
        }
        :host ::ng-deep .blog1-section-area.sp1 {
            padding-top: 40px !important;
        }

        .calendario-toolbar select {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 8px 14px;
            font-size: 13px;
            color: #555;
            background: #fff;
        }
        .mes-nav-title {
            font-size: 17px;
            font-weight: 600;
            color: #222;
            min-width: 170px;
            text-align: center;
        }
        .btn-hoy {
            padding: 7px 18px;
            border-radius: 20px;
            border: 1px solid #ddd;
            background: #fff;
            font-size: 13px;
            cursor: pointer;
            transition: all .3s;
        }
        .btn-hoy:hover { background: #c1272d; color: #fff; border-color: #c1272d; }

        .resumen-mes { font-size: 13px; color: #777; margin-bottom: 14px; }
        .resumen-mes b { color: #333; }

        .calendario-wrap { border: 1px solid #eee; border-radius: 14px; overflow: hidden; }
        .calendario-grid-header {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            background: #faf6f6;
            border-bottom: 1px solid #eee;
        }
        .calendario-grid-header div {
            text-align: center;
            padding: 10px 0;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .5px;
            color: #999;
        }
        .calendario-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
        }
        .calendario-celda {
            min-height: 96px;
            padding: 6px 3px;
            border-right: 1px solid #f2f2f2;
            border-bottom: 1px solid #f2f2f2;
            cursor: pointer;
            transition: background .2s;
        }
        .calendario-celda:hover { background: #fdf8f8; }
        .calendario-celda.otro-mes { background: #fafafa; }
        .calendario-celda.seleccionado { background: #fdf1f1; box-shadow: inset 0 0 0 2px #c1272d; }

        .dia-numero {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            font-size: 12px;
            font-weight: 600;
            color: #555;
            margin: 0 4px;
        }
        .dia-numero.hoy { background: #c1272d; color: #fff; }
        .dia-numero.otro-mes-txt { color: #ccc; }

        .evento-bar {
            height: 19px;
            line-height: 19px;
            color: #fff;
            font-size: 10.5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-top: 3px;
            padding: 0 6px;
        }
        .evento-bar.pasado { opacity: .5; }
        .evento-bar-unico  { border-radius: 10px; margin-left: 4px; margin-right: 4px; }
        .evento-bar-inicio { border-radius: 10px 0 0 10px; margin-left: 4px; margin-right: 0; }
        .evento-bar-medio  { border-radius: 0; margin-left: 0; margin-right: 0; }
        .evento-bar-fin    { border-radius: 0 10px 10px 0; margin-left: 0; margin-right: 4px; }
        .mas-eventos { font-size: 10.5px; color: #aaa; padding: 2px 6px; }

        .leyenda { margin-top: 16px; }
        .leyenda-item {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: #777;
            margin-right: 18px;
            margin-top: 8px;
        }
        .leyenda-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }

        .dia-detalle {
            border: 1px solid #f0d9d9;
            background: #fdf7f7;
            border-radius: 12px;
            padding: 18px;
            margin-top: 22px;
        }
        .dia-evento-item {
            display: flex;
            gap: 12px;
            padding: 14px;
            border: 1px solid #eee;
            border-radius: 10px;
            margin-bottom: 10px;
            background: #fff;
        }
        .tipo-badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 600;
            color: #fff;
            padding: 3px 10px;
            border-radius: 20px;
        }

        @media (max-width: 576px) {
            .calendario-celda { min-height: 64px; }
            .dia-numero { width: 20px; height: 20px; font-size: 11px; }
            .evento-bar { font-size: 9px; height: 16px; line-height: 16px; }
            .mes-nav-title { font-size: 14px; min-width: 120px; }
        }
    `]
})
export class CalendarioAcademicoComponent implements OnInit {
    private service = inject(CalendarioAcademicoService);
    private cdr = inject(ChangeDetectorRef);
    private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    readonly CONSTANTS = CALENDARIO_ACADEMICO;
    readonly tipos = TIPOS_EVENTO;
    readonly diasSem = DIAS;
    readonly hoy = new Date();

    cargando = true;
    private todos: CalendarioAcademico[] = [];

    mesActual = this.hoy.getMonth();
    anioActual = this.hoy.getFullYear();
    diaSeleccionado: Date | null = null;
    filtroTipo = '';

    diasGrid: DiaGrid[] = [];
    tituloMes = '';
    estadosMes: { total: number } = { total: 0 };
    eventosDelDia: CalendarioAcademico[] = [];

    private eventosFiltrados: CalendarioAcademico[] = [];
    private eventosPorDiaMap = new Map<string, CalendarioAcademico[]>();
    private eventosEnCeldaCache = new Map<string, CalendarioAcademico[]>();

    ngOnInit(): void {
        this.recalcular();

        if (!this.isBrowser) return;

        this.service.getAll(500).subscribe({
            next: (res) => {
                this.todos = res.data;
                this.cargando = false;
                this.recalcular();
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('[calendario-academico] Error al cargar eventos:', err);
                this.todos = [];
                this.cargando = false;
                this.recalcular();
                this.cdr.detectChanges();
            },
        });
    }

    private recalcular(): void {
        this.eventosFiltrados = this.filtroTipo ? this.todos.filter((e) => e.tipo === this.filtroTipo) : this.todos;
        this.tituloMes = `${MESES[this.mesActual]} ${this.anioActual}`;
        this.diasGrid = this.calcularDiasGrid();
        this.eventosPorDiaMap = this.calcularEventosPorDiaMap();
        this.eventosEnCeldaCache = new Map();
        this.estadosMes = this.calcularEstadosMes();
        this.eventosDelDia = this.diaSeleccionado
            ? this.eventosPorDiaMap.get(this.toKey(this.diaSeleccionado)) ?? []
            : [];
    }

    onFiltroTipo(e: Event): void {
        this.filtroTipo = (e.target as HTMLSelectElement).value;
        this.recalcular();
        this.cdr.detectChanges();
    }

    private calcularDiasGrid(): DiaGrid[] {
        const year = this.anioActual;
        const month = this.mesActual;
        let primerDia = new Date(year, month, 1).getDay();
        primerDia = primerDia === 0 ? 6 : primerDia - 1;
        const diasEnMes = new Date(year, month + 1, 0).getDate();
        const diasMesAnterior = new Date(year, month, 0).getDate();
        const dias: DiaGrid[] = [];

        for (let i = primerDia - 1; i >= 0; i--) {
            dias.push({ fecha: new Date(year, month - 1, diasMesAnterior - i), otroMes: true, esHoy: false });
        }

        for (let d = 1; d <= diasEnMes; d++) {
            const fecha = new Date(year, month, d);
            dias.push({ fecha, otroMes: false, esHoy: this.mismaFecha(fecha, this.hoy) });
        }

        const total = dias.length <= 35 ? 35 : 42;
        let next = 1;
        while (dias.length < total) {
            dias.push({ fecha: new Date(year, month + 1, next++), otroMes: true, esHoy: false });
        }

        return dias;
    }

    private calcularEventosPorDiaMap(): Map<string, CalendarioAcademico[]> {
        const map = new Map<string, CalendarioAcademico[]>();
        for (const ev of this.eventosFiltrados) {
            const inicio = this.soloFecha(new Date(ev.fecha_inicio));
            const fin = ev.fecha_fin ? this.soloFecha(new Date(ev.fecha_fin)) : new Date(inicio);
            const curr = new Date(inicio);
            while (curr <= fin) {
                const key = this.toKey(curr);
                if (!map.has(key)) map.set(key, []);
                map.get(key)!.push(ev);
                curr.setDate(curr.getDate() + 1);
            }
        }
        return map;
    }

    eventosEnCelda(dia: Date): CalendarioAcademico[] {
        const key = this.toKey(dia);
        let cached = this.eventosEnCeldaCache.get(key);
        if (!cached) {
            cached = this.eventosPorDiaMap.get(key) ?? [];
            this.eventosEnCeldaCache.set(key, cached);
        }
        return cached;
    }

    private calcularEstadosMes(): { total: number } {
        const evs = this.eventosFiltrados.filter((e) => {
            const d = new Date(e.fecha_inicio);
            return d.getFullYear() === this.anioActual && d.getMonth() === this.mesActual;
        });
        return { total: evs.length };
    }

    posEvento(dia: Date, ev: CalendarioAcademico): PosEvento {
        const inicio = this.soloFecha(new Date(ev.fecha_inicio));
        const fin = ev.fecha_fin ? this.soloFecha(new Date(ev.fecha_fin)) : new Date(inicio);
        const esInicio = this.mismaFecha(dia, inicio);
        const esFin = this.mismaFecha(dia, fin);
        if (esInicio && esFin) return 'unico';
        if (esInicio) return 'inicio';
        if (esFin) return 'fin';
        return 'medio';
    }

    barClasses(pos: PosEvento): string {
        return {
            unico: 'evento-bar-unico',
            inicio: 'evento-bar-inicio',
            medio: 'evento-bar-medio',
            fin: 'evento-bar-fin',
        }[pos];
    }

    esPasado(ev: CalendarioAcademico): boolean {
        const fin = ev.fecha_fin ? new Date(ev.fecha_fin) : new Date(ev.fecha_inicio);
        return this.soloFecha(fin) < this.soloFecha(this.hoy);
    }

    seleccionarDia(dia: DiaGrid): void {
        if (dia.otroMes) {
            this.mesActual = dia.fecha.getMonth();
            this.anioActual = dia.fecha.getFullYear();
        }
        const prev = this.diaSeleccionado;
        this.diaSeleccionado = prev && this.mismaFecha(prev, dia.fecha) ? null : dia.fecha;
        this.recalcular();
        this.cdr.detectChanges();
    }

    cerrarDetalle(): void {
        this.diaSeleccionado = null;
        this.recalcular();
        this.cdr.detectChanges();
    }

    esDiaSeleccionado(dia: Date): boolean {
        return !!this.diaSeleccionado && this.mismaFecha(this.diaSeleccionado, dia);
    }

    mesAnterior(): void {
        if (this.mesActual === 0) { this.mesActual = 11; this.anioActual -= 1; }
        else this.mesActual -= 1;
        this.diaSeleccionado = null;
        this.recalcular();
        this.cdr.detectChanges();
    }

    mesSiguiente(): void {
        if (this.mesActual === 11) { this.mesActual = 0; this.anioActual += 1; }
        else this.mesActual += 1;
        this.diaSeleccionado = null;
        this.recalcular();
        this.cdr.detectChanges();
    }

    irAHoy(): void {
        this.mesActual = this.hoy.getMonth();
        this.anioActual = this.hoy.getFullYear();
        this.diaSeleccionado = null;
        this.recalcular();
        this.cdr.detectChanges();
    }

    tipoLabel(tipo: string | null): string {
        return this.tipos.find((t) => t.value === tipo)?.label ?? tipo ?? 'Otro';
    }

    tipoColor(tipo: string | null): string {
        return this.tipos.find((t) => t.value === tipo)?.color ?? '#6b7280';
    }

    eventoColor(ev: CalendarioAcademico): string {
        return ev.color || this.tipoColor(ev.tipo);
    }

    formatDiaSel(fecha: Date): string {
        return fecha.toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    private mismaFecha(a: Date, b: Date): boolean {
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    private soloFecha(d: Date): Date {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    private toKey(d: Date): string {
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }
}
