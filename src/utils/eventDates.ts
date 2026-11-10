/** Evening activities have no end time, so an agenda is marked as past only
 * once its calendar day has ended in Chișinău, independently of the viewer's timezone. */
export function hasEventDatePassed(date: string | undefined, now = new Date()): boolean {
  if (!date) return false;
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Chisinau", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value;
  const today = `${part("year")}-${part("month")}-${part("day")}`;
  return date < today;
}
