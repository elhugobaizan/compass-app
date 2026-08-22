import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import type { Coordinates } from "@/utils/geo";

/**
 * Leaflet arma solo la URL de sus íconos asumiendo que están servidos como
 * archivos sueltos. Con Vite eso no existe (van con hash), así que el marcador
 * sale roto salvo que se declare el ícono explícitamente, como acá.
 */
const DEFAULT_ICON = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Mendoza capital: centro por defecto cuando no hay nada más
const FALLBACK_CENTER: Coordinates = { latitude: -32.8895, longitude: -68.8458 };

type LocationMapPickerProps = {
  readonly value: Coordinates | null;
  readonly onChange: (coordinates: Coordinates) => void;
  /** Centro a usar mientras no hay marcador. */
  readonly initialCenter?: Coordinates | null;
};

/** Mueve el marcador al hacer click en cualquier punto del mapa. */
function ClickHandler({
  onChange,
}: {
  readonly onChange: (coordinates: Coordinates) => void;
}): null {
  useMapEvents({
    click(event) {
      onChange({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    },
  });

  return null;
}

/**
 * Recentra el mapa cuando las coordenadas cambian desde afuera
 * (botón "Usar mi ubicación" o un resultado del buscador).
 */
function Recenter({ target }: { readonly target: Coordinates | null }): null {
  const map = useMap();
  const lastRef = useRef<string | null>(null);

  useEffect(() => {
    if (!target) return;

    const key = `${target.latitude},${target.longitude}`;
    if (lastRef.current === key) return;
    lastRef.current = key;

    map.setView([target.latitude, target.longitude], Math.max(map.getZoom(), 16));
  }, [map, target]);

  return null;
}

/**
 * El mapa se monta con un tamaño y el modal puede abrirse con una animación:
 * si Leaflet mide antes de tiempo, los tiles quedan grises hasta que se mueve.
 */
function InvalidateOnMount(): null {
  const map = useMap();

  useEffect(() => {
    const timer = globalThis.setTimeout(() => map.invalidateSize(), 150);
    return () => globalThis.clearTimeout(timer);
  }, [map]);

  return null;
}

export default function LocationMapPicker({
  value,
  onChange,
  initialCenter = null,
}: LocationMapPickerProps): JSX.Element {
  // El centro inicial se fija una sola vez: después manda el usuario
  const [center] = useState<Coordinates>(
    () => value ?? initialCenter ?? FALLBACK_CENTER,
  );

  const markerHandlers = useMemo(
    () => ({
      dragend(event: L.DragEndEvent) {
        const { lat, lng } = (event.target as L.Marker).getLatLng();
        onChange({ latitude: lat, longitude: lng });
      },
    }),
    [onChange],
  );

  return (
    <div className="h-[260px] w-full overflow-hidden rounded-xl border border-[var(--color-border)]">
      <MapContainer
        center={[center.latitude, center.longitude]}
        zoom={value ? 16 : 13}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <ClickHandler onChange={onChange} />
        <Recenter target={value} />
        <InvalidateOnMount />

        {value && (
          <Marker
            position={[value.latitude, value.longitude]}
            icon={DEFAULT_ICON}
            draggable
            eventHandlers={markerHandlers}
          />
        )}
      </MapContainer>
    </div>
  );
}
