export type ThemeId = "ciruela" | "terracota" | "oliva" | "teal";

export const DEFAULT_THEME: ThemeId = "ciruela";

export type ThemeOption = {
  readonly id: ThemeId;
  readonly label: string;
  readonly swatch: string;
};

export const THEME_OPTIONS: ReadonlyArray<ThemeOption> = [
  { id: "ciruela", label: "Ciruela & salvia", swatch: "#7C4B63" },
  { id: "terracota", label: "Terracota & bosque", swatch: "#B85C38" },
  { id: "oliva", label: "Oliva & miel", swatch: "#7C7A34" },
  { id: "teal", label: "Teal & ámbar", swatch: "#2F6E6A" },
];

export function isTheme(value: unknown): value is ThemeId {
  return THEME_OPTIONS.some((option) => option.id === value);
}
