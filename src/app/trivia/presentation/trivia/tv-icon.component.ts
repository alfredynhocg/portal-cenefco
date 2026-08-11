import { Component, Input, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export type TvIconName =
  | 'candado' | 'trofeo' | 'reloj' | 'chispa' | 'corazon' | 'corazon-vacio'
  | 'check' | 'cruz' | 'cerrar' | 'ranking' | 'giro' | 'flecha'
  | 'libro' | 'atomo' | 'globo' | 'paleta' | 'nota-musical' | 'pelicula'
  | 'trofeo-deporte' | 'pata' | 'brujula' | 'codigo' | 'calculadora' | 'pregunta'
  | 'regalo' | 'ticket' | 'sonido' | 'sonido-mute' | 'espadas' | 'copiar' | 'usuarios';

const PATHS: Record<TvIconName, string> = {
  candado: '<rect x="4" y="11" width="16" height="9" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path>',
  trofeo: '<path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"></path><path d="M17 5h2.5A1.5 1.5 0 0 1 21 6.5 4.5 4.5 0 0 1 17 11"></path><path d="M7 5H4.5A1.5 1.5 0 0 0 3 6.5 4.5 4.5 0 0 0 7 11"></path>',
  reloj: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 3"></path>',
  chispa: '<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>',
  corazon: '<path d="M12 20s-7-4.5-9.5-9C.7 7.4 2.3 4 5.8 4 8 4 9.8 5.3 12 8c2.2-2.7 4-4 6.2-4 3.5 0 5.1 3.4 3.3 7-2.5 4.5-9.5 9-9.5 9Z"></path>',
  'corazon-vacio': '<path d="M12 20s-7-4.5-9.5-9C.7 7.4 2.3 4 5.8 4 8 4 9.8 5.3 12 8c2.2-2.7 4-4 6.2-4 3.5 0 5.1 3.4 3.3 7-2.5 4.5-9.5 9-9.5 9Z"></path>',
  check: '<polyline points="20 6 9 17 4 12"></polyline>',
  cruz: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
  cerrar: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
  ranking: '<path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"></path><path d="M17 5h2.5A1.5 1.5 0 0 1 21 6.5 4.5 4.5 0 0 1 17 11"></path><path d="M7 5H4.5A1.5 1.5 0 0 0 3 6.5 4.5 4.5 0 0 0 7 11"></path>',
  giro: '<path d="M21 12a9 9 0 1 1-3.05-6.75"></path><polyline points="21 3 21 9 15 9"></polyline>',
  flecha: '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>',
  libro: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"></path>',
  atomo: '<circle cx="12" cy="12" r="1"></circle><ellipse cx="12" cy="12" rx="10" ry="4.2"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"></ellipse>',
  globo: '<circle cx="12" cy="12" r="9"></circle><line x1="3" y1="12" x2="21" y2="12"></line><path d="M12 3a14 14 0 0 1 0 18"></path><path d="M12 3a14 14 0 0 0 0 18"></path>',
  paleta: '<path d="M12 2a10 10 0 1 0 0 20c1.5 0 2-1 2-2s-.5-1.5-.5-2.5S14.5 16 15.5 16H17a4 4 0 0 0 4-4c0-5.5-4.5-10-9-10Z"></path><circle cx="7" cy="12" r="1"></circle><circle cx="9" cy="8" r="1"></circle><circle cx="14" cy="7" r="1"></circle><circle cx="17" cy="10" r="1"></circle>',
  'nota-musical': '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>',
  pelicula: '<rect x="3" y="4" width="18" height="16" rx="2"></rect><line x1="7" y1="4" x2="7" y2="20"></line><line x1="17" y1="4" x2="17" y2="20"></line><line x1="3" y1="9" x2="7" y2="9"></line><line x1="3" y1="15" x2="7" y2="15"></line><line x1="17" y1="9" x2="21" y2="9"></line><line x1="17" y1="15" x2="21" y2="15"></line>',
  'trofeo-deporte': '<circle cx="12" cy="10" r="6"></circle><path d="M9 21h6"></path><path d="M12 16v5"></path><path d="M8 9.5l2.5 2 3.5-4.5"></path>',
  pata: '<circle cx="7" cy="9" r="1.6"></circle><circle cx="12" cy="6.5" r="1.6"></circle><circle cx="17" cy="9" r="1.6"></circle><path d="M12 12c-3 0-5.5 2-5.5 4.5S8.5 20 12 20s5.5-1 5.5-3.5S15 12 12 12Z"></path>',
  brujula: '<circle cx="12" cy="12" r="9"></circle><polygon points="14.5 9.5 13 13 9.5 14.5 11 11 14.5 9.5"></polygon>',
  codigo: '<polyline points="8 6 3 12 8 18"></polyline><polyline points="16 6 21 12 16 18"></polyline>',
  calculadora: '<rect x="5" y="2" width="14" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="8" y1="11" x2="8" y2="11.01"></line><line x1="12" y1="11" x2="12" y2="11.01"></line><line x1="16" y1="11" x2="16" y2="11.01"></line><line x1="8" y1="15" x2="8" y2="15.01"></line><line x1="12" y1="15" x2="12" y2="15.01"></line><line x1="16" y1="15" x2="16" y2="15.01"></line><line x1="8" y1="19" x2="16" y2="19"></line>',
  pregunta: '<circle cx="12" cy="12" r="9"></circle><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"></path><line x1="12" y1="16.5" x2="12" y2="16.51"></line>',
  regalo: '<rect x="3" y="8" width="18" height="4"></rect><path d="M12 8v13"></path><path d="M19 12v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7"></path><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"></path>',
  ticket: '<path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z"></path><line x1="10" y1="7" x2="10" y2="17" stroke-dasharray="2 2"></line>',
  sonido: '<polygon points="4 9 8 9 12 5 12 19 8 15 4 15 4 9"></polygon><path d="M16.5 8.5a5 5 0 0 1 0 7"></path><path d="M19 6a9 9 0 0 1 0 12"></path>',
  'sonido-mute': '<polygon points="4 9 8 9 12 5 12 19 8 15 4 15 4 9"></polygon><line x1="17" y1="9" x2="22" y2="14"></line><line x1="22" y1="9" x2="17" y2="14"></line>',
  espadas: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"></path><path d="M13 19l6-6"></path><path d="M16 16l4 4"></path><path d="M19 21l2-2"></path><path d="M9.5 6.5 21 18v3h-3L6.5 9.5"></path><path d="M5 14l6 6"></path><path d="M8 21l-2-2"></path><path d="M3 19l2-2"></path>',
  copiar: '<rect x="9" y="9" width="12" height="12" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>',
  usuarios: '<path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
};

const ICONOS_RELLENOS: ReadonlySet<TvIconName> = new Set(['corazon']);
const SAFE_HTML_CACHE = new Map<TvIconName, SafeHtml>();

const PALETA_CATEGORIAS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'] as const;

const CATEGORIA_ICONOS: Record<string, TvIconName> = {
  historia: 'ranking',
  ciencia: 'atomo',
  tecnologia: 'codigo',
  cultura: 'globo',
  geografia: 'brujula',
  deporte: 'trofeo-deporte',
  arte: 'paleta',
  musica: 'nota-musical',
  cine: 'pelicula',
  literatura: 'libro',
  matematica: 'calculadora',
  animal: 'pata',
};

const CATEGORIA_COLOR: Record<string, string> = {
  historia: PALETA_CATEGORIAS[0],
  ciencia: PALETA_CATEGORIAS[1],
  tecnologia: PALETA_CATEGORIAS[2],
  cultura: PALETA_CATEGORIAS[3],
  geografia: PALETA_CATEGORIAS[4],
  deporte: PALETA_CATEGORIAS[5],
  arte: PALETA_CATEGORIAS[6],
  musica: PALETA_CATEGORIAS[7],
  cine: PALETA_CATEGORIAS[0],
  literatura: PALETA_CATEGORIAS[1],
  matematica: PALETA_CATEGORIAS[2],
  animal: PALETA_CATEGORIAS[3],
};

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function claveCategoria(nombre: string): string | null {
  const n = normalizar(nombre);
  return Object.keys(CATEGORIA_ICONOS).find(k => n.includes(k)) ?? null;
}

export function iconoParaCategoria(nombre: string): TvIconName {
  const clave = claveCategoria(nombre);
  return clave ? CATEGORIA_ICONOS[clave] : 'chispa';
}

export function colorParaCategoria(nombre: string): string {
  const clave = claveCategoria(nombre);
  return clave ? CATEGORIA_COLOR[clave] : '#7c3aed';
}

@Component({
  selector: 'tv-icon',
  standalone: true,
  template: `
    <span
      class="tv-icon-badge"
      [class.tv-icon-badge--activo]="badge"
      [style.--tv-icon-color]="color"
      [style.width.px]="badge ? badgeSize : null"
      [style.height.px]="badge ? badgeSize : null">
      <svg
        [attr.width]="size" [attr.height]="size"
        viewBox="0 0 24 24" [attr.fill]="relleno ? 'currentColor' : 'none'" [attr.stroke]="color ?? 'currentColor'"
        [attr.stroke-width]="strokeWidth" stroke-linecap="round" stroke-linejoin="round"
        [innerHTML]="path"
      ></svg>
    </span>
  `,
})
export class TvIconComponent {
  private sanitizer = inject(DomSanitizer);

  @Input() name: TvIconName = 'pregunta';
  @Input() size = 20;
  @Input() strokeWidth = 2;
  @Input() color: string | null = null;
  @Input() badge = false;
  @Input() badgeSize = 40;

  get path(): SafeHtml {
    const nombre = PATHS[this.name] ? this.name : 'pregunta';
    let cached = SAFE_HTML_CACHE.get(nombre);
    if (!cached) {
      cached = this.sanitizer.bypassSecurityTrustHtml(PATHS[nombre]);
      SAFE_HTML_CACHE.set(nombre, cached);
    }
    return cached;
  }

  get relleno(): boolean {
    return ICONOS_RELLENOS.has(this.name);
  }
}
