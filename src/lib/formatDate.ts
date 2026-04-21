function ordinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export function formatArticleDate(iso: string): string {
  const date = new Date(iso);
  const day = Number(new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(date));
  const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);
  const year = new Intl.DateTimeFormat('en-GB', { year: 'numeric' }).format(date);
  return `${day}${ordinalSuffix(day)} ${month} ${year}`;
}
