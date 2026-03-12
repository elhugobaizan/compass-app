import { DimensionValue, View, Text, ViewStyle } from "react-native";

export interface PercentBarSegment {
  readonly value: number;
  readonly color?: string;
  readonly label?: string;
}

const DEFAULT_COLORS = [
  "rgb(14, 116, 144)",
  "rgb(16, 185, 129)",
  "rgb(245, 158, 11)",
  "rgb(139, 92, 246)",
  "rgb(236, 72, 153)",
];

export interface PercentBarProps {
  /** Lista de segmentos: valor, color opcional y etiqueta opcional */
  readonly items: PercentBarSegment[];
  /** Altura de la barra en px */
  readonly height?: number;
  /** Mostrar etiquetas debajo con porcentajes */
  readonly showLabels?: boolean;
  /** Estilo del contenedor */
  readonly style?: ViewStyle;
  /** Ancho del contenedor (ej. 350, "100%") */
  readonly size?: DimensionValue;
  /** Mostrar espacio entre segmentos */
  readonly spacing?: boolean;
}

/**
 * Barra de porcentajes con un número variable de segmentos.
 * Calcula los porcentajes a partir de la suma de todos los valores.
 */
export function PercentBar({
  items,
  height = 8,
  showLabels = false,
  style,
  spacing = false,
  size = "100%",
}: PercentBarProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const segments = items.map((item, index) => ({
    ...item,
    color: item.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    pct: total > 0 ? (item.value / total) * 100 : 100 / items.length,
  }));

  const isFirst = (i: number) => i === 0;
  const isLast = (i: number) => i === segments.length - 1;

  return (
    <View style={[{ width: size }, style]}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height,
          borderRadius: height / 2,
          overflow: "hidden",
          backgroundColor: "rgba(15, 23, 42, 0.08)",
        }}
      >
        {segments.map(
          (seg, i) =>
            seg.pct > 0 && (
              <View
                key={`${seg.label ?? "pct"}-${seg.pct}-${i}`}
                style={{
                  width: `${seg.pct}%`,
                  height,
                  backgroundColor: seg.color,
                  borderTopLeftRadius: isFirst(i) ? height / 2 : 0,
                  borderBottomLeftRadius: isFirst(i) ? height / 2 : 0,
                  borderTopRightRadius: isLast(i) ? height / 2 : 0,
                  borderBottomRightRadius: isLast(i) ? height / 2 : 0,
                  marginRight: spacing && i < segments.length - 1 ? 2 : 0,
                }}
              />
            )
        )}
      </View>
      {showLabels && segments.some((s) => s.label != null) && (
        <View style={{ flexDirection: "row", marginTop: 6, gap: 16, flexWrap: "wrap" }}>
          {segments.map(
            (seg, i) =>
              seg.label != null && (
                <View key={seg.label} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: seg.color,
                    }}
                  />
                  <Text style={{ fontSize: 12, color: "rgb(100, 116, 139)" }}>
                    {seg.label} {total > 0 ? `${seg.pct.toFixed(0)}%` : "—"}
                  </Text>
                </View>
              )
          )}
        </View>
      )}
    </View>
  );
}
