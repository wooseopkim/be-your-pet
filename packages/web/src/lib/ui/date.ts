const defaultPattern = /(?<yyyy>\d{4})(?<mm>\d{2})(?<dd>\d{2})/;

export function parseString(s: string, pattern = defaultPattern) {
  const { yyyy, mm, dd } = s.match(pattern)?.groups ?? {};
  const year = Number.parseInt(yyyy, 10);
  const month = Number.parseInt(mm, 10) - 1;
  const date = Number.parseInt(dd, 10);
  return new Date(year, month, date);
}

export function format(d: Date): string {
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  return `${year.toString().slice(2)}년 ${month}월 ${date}일`;
}
