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

export function parseLocalDate(dateString: string): Date | null {
  if(dateString) {
    const [date] = dateString.split('T');
    const [year, month, day] = date.split("-").map(Number);
  
    return new Date(year, month - 1, day);
  }

  return null;
}