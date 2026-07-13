// Mapea el nombre de archivo del logo (guardado en DB, ej. "BBVA.Logo.jpg")
// a la URL del asset bundleado por Vite desde src/assets.
const modules = import.meta.glob("../assets/*.Logo.*", {
  eager: true,
  query: "?url",
  import: "default",
});

const logoByFilename: Record<string, string> = {};

for (const path in modules) {
  const filename = path.split("/").pop();
  if (filename) {
    logoByFilename[filename] = modules[path] as string;
  }
}

/**
 * Devuelve la URL del logo si el archivo existe en assets, o null.
 */
export function getLogoUrl(logo?: string | null): string | null {
  if (!logo) return null;
  return logoByFilename[logo] ?? null;
}
