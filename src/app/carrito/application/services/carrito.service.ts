import { Injectable, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ItemCarrito } from '../../domain/models/carrito.model';
import { Curso } from '../../../cursos/domain/models/curso.model';

const STORAGE_KEY = 'cenefco_carrito';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private _items = signal<ItemCarrito[]>(this._cargarStorage());

  readonly items    = this._items.asReadonly();
  readonly cantidad = computed(() => this._items().length);
  readonly total    = computed(() =>
    this._items().reduce((sum, i) => {
      const precio = i.plan_costo != null ? Number(i.plan_costo) : Number(i.inversion ?? 0);
      return sum + (isNaN(precio) ? 0 : precio);
    }, 0)
  );

  private _cargarStorage(): ItemCarrito[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ItemCarrito[]) : [];
    } catch {
      return [];
    }
  }

  private _guardarStorage(): void {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
  }

  estaEnCarrito(id_programa: number): boolean {
    return this._items().some(i => i.id_programa === id_programa);
  }

  agregar(curso: Curso): void {
    if (this.estaEnCarrito(curso.id_programa)) return;
    this._items.update(items => [
      ...items,
      {
        id_programa:     curso.id_programa,
        nombre_programa: curso.nombre_programa,
        slug:            curso.slug,
        foto:            curso.foto ?? curso.imagen_banner_url,
        plan_costo:      curso.plan_costo,
        plan_nro_cuotas: curso.plan_nro_cuotas,
        id_plan:         curso.id_plan,
        inversion:       curso.inversion,
      },
    ]);
    this._guardarStorage();
  }

  quitar(id_programa: number): void {
    this._items.update(items => items.filter(i => i.id_programa !== id_programa));
    this._guardarStorage();
  }

  vaciar(): void {
    this._items.set([]);
    this._guardarStorage();
  }
}
