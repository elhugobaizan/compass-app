export function isSameMonth(date: string, base: Date) {
  const d = new Date(date);

  return (
    d.getFullYear() === base.getFullYear() &&
    d.getMonth() === base.getMonth()
  );
}

export function isPreviousMonth(date: string, base: Date) {
  const d = new Date(date);

  const prev = new Date(base.getFullYear(), base.getMonth() - 1, 1);

  return (
    d.getFullYear() === prev.getFullYear() &&
    d.getMonth() === prev.getMonth()
  );
}

export function isCurrentMonth(dateString: string): boolean {
  const input = new Date(dateString);
  const now = new Date();

  return (
    input.getFullYear() === now.getFullYear() &&
    input.getMonth() === now.getMonth()
  );
}

export function parseLocalDate(dateString: string): Date {
  const [date] = dateString.split('T');
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameLocalDate(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function isTodayDateString(dateString?: string | null): boolean {
  if (!dateString) return false;

  const local = parseLocalDate(dateString);
  if (!local) return false;

  return isSameLocalDate(local, new Date());
}

export function getDaysFromToday(dateString?: string | null): number | null {
  if (!dateString) return null;

  const today = startOfLocalDay(new Date());
  const local = parseLocalDate(dateString);
  if (!local) return null;

  const target = startOfLocalDay(local);
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / 86_400_000);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function getMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function getTodayKey(): string | null {
  return toDateKey(new Date());
}

export function toDateKey(value: Date | string | null | undefined): string {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return [
    date.getFullYear(),
    pad2(date.getMonth() + 1),
    pad2(date.getDate()),
  ].join("-");
}