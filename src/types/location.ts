export type Location = {
  id: number;
  name: string;
  /** Coordenadas opcionales: un lugar puede existir sin ubicación en el mapa. */
  latitude?: string | number | null;
  longitude?: string | number | null;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};
