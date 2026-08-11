import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MenuItem, MenuItemsResponse } from '../../domain/models/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/public/menus';

  getMenuItems(nombre: string): Observable<MenuItem[]> {
    return this.http
      .get<MenuItemsResponse>(`${this.baseUrl}/${nombre}/items`)
      .pipe(map(res => this.buildTree(res.data)));
  }

  private buildTree(items: MenuItem[]): MenuItem[] {
    const map = new Map<number, MenuItem>();
    const roots: MenuItem[] = [];

    items.forEach(item => map.set(item.id, { ...item, children: [] }));

    map.forEach(item => {
      if (item.parent_id === null) {
        roots.push(item);
      } else {
        const parent = map.get(item.parent_id);
        if (parent) parent.children!.push(item);
      }
    });

    return roots.sort((a, b) => a.orden - b.orden);
  }
}
