export interface GaleriaItem {
  id: number;
  galeria_id: number;
  tipo: 'foto' | 'video';
  url: string;
  thumbnail_url: string | null;
  titulo: string | null;
  descripcion: string | null;
  orden: number;
  created_at: string | null;
}

export interface GaleriaItemsResponse {
  data: GaleriaItem[];
  total: number;
}
