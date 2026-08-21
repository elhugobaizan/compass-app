// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:3000";

type RequestOptions = RequestInit & {
  query?: Record<string, string | number | boolean | undefined | null>;
};

/**
 * Error de API con el mensaje ya listo para mostrarle al usuario.
 * El detalle técnico queda en `detail` (para consola), nunca en `message`:
 * antes el banner terminaba pintando el JSON crudo del backend.
 */
export class ApiError extends Error {
  /** 0 cuando no hubo respuesta (backend caído o sin red). */
  readonly status: number;
  readonly detail?: string;

  constructor(message: string, status: number, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

/**
 * Mensaje a mostrar en un banner. `apiFetch` ya devuelve errores con el texto
 * limpio, así que acá sólo hace falta cubrir el caso de que venga otra cosa.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

// Firmas de Prisma/Neon cuando se cae la conexión con la base
const CONNECTION_ERROR_SIGNATURES = [
  "Server has closed the connection",
  "Can't reach database server",
  "Timed out fetching a new connection",
  "Connection terminated",
  "ECONNRESET",
];

function isConnectionError(text: string): boolean {
  return CONNECTION_ERROR_SIGNATURES.some((signature) => text.includes(signature));
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Saca un mensaje legible del cuerpo de una respuesta con error.
 * El backend responde `{ error, detail }`, pero también puede llegar una
 * página HTML (proxy, 502) o texto plano.
 */
function parseErrorBody(body: string, status: number): ApiError {
  const trimmed = body.trim();

  if (!trimmed) {
    return new ApiError(`Error del servidor (${status}).`, status);
  }

  let message: string | null = null;
  let detail: string | undefined;

  try {
    const parsed: unknown = JSON.parse(trimmed);

    if (typeof parsed === "string") {
      // Algunos endpoints responden un string suelto (ej. 409 de cuenta con activos)
      message = parsed;
    } else if (parsed && typeof parsed === "object") {
      const shape = parsed as { error?: unknown; detail?: unknown };
      if (typeof shape.error === "string") message = shape.error;
      if (typeof shape.detail === "string") detail = shape.detail;

      // Errores de validación de zod: vienen como árbol de campos
      if (!message && "_errors" in shape) {
        message = "Hay datos inválidos en el formulario.";
        detail = trimmed;
      }
    }
  } catch {
    // No era JSON: puede ser una página de error HTML
    if (trimmed.includes("<!DOCTYPE html>") || trimmed.includes("<html")) {
      const pre = trimmed.match(/<pre>([\s\S]*?)<\/pre>/i);
      message = pre?.[1]?.trim() ?? null;
      detail = trimmed;
    } else {
      message = trimmed;
    }
  }

  // La base se cayó: el mensaje del backend ("No se pudo crear transactions")
  // no le dice nada al usuario, el detalle técnico sí lo delata.
  if (isConnectionError(detail ?? "") || isConnectionError(trimmed)) {
    return new ApiError(
      "Se cortó la conexión con la base de datos. Probá de nuevo en unos segundos.",
      status,
      detail ?? trimmed,
    );
  }

  return new ApiError(message || `Error del servidor (${status}).`, status, detail);
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { query, headers, ...rest } = options;

  let response: Response;

  try {
    response = await fetch(buildUrl(path, query), {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...rest,
    });
  } catch (error) {
    // fetch sólo rechaza por red: backend caído, CORS, sin internet
    throw new ApiError(
      "No pudimos conectar con el servidor. Revisá que esté levantado.",
      0,
      error instanceof Error ? error.message : String(error),
    );
  }

  if (!response.ok) {
    const body = await response.text();
    const apiError = parseErrorBody(body, response.status);

    // El detalle técnico va a consola, no al banner
    if (apiError.detail) {
      console.error(`[api] ${path} → ${response.status}:`, apiError.detail);
    }

    throw apiError;
  }

  return response.json() as Promise<T>;
}
