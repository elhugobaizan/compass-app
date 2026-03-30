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
  if(!local) return false;

  return isSameLocalDate(local, new Date());
}

export function getDaysFromToday(dateString?: string | null): number | null {
  if (!dateString) return null;

  const today = startOfLocalDay(new Date());
  const local = parseLocalDate(dateString);
  if(!local) return null;

  const target = startOfLocalDay(local);
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / 86_400_000);
}