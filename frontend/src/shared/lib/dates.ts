export function toUtcDateOnly(data: Date): Date {
  return new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()))
}
