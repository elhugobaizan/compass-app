import { apiFetch } from "./api";
import type { Location } from "@/types/location";

export type CreateLocationInput = {
  name: string;
  latitude?: number | null;
  longitude?: number | null;
};

export type UpdateLocationInput = Partial<CreateLocationInput>;

export function getLocations(): Promise<Location[]> {
  return apiFetch<Location[]>("/locations");
}

export function createLocation(data: CreateLocationInput): Promise<Location> {
  return apiFetch<Location>("/locations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateLocation(
  id: number,
  data: UpdateLocationInput,
): Promise<Location> {
  return apiFetch<Location>(`/locations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteLocation(id: number): Promise<{ success?: boolean }> {
  return apiFetch<{ success?: boolean }>(`/locations/${id}`, {
    method: "DELETE",
  });
}
