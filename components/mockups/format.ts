/* Grouping is done by hand rather than through Intl.NumberFormat: these values
   render on the server and then re-render on the client as the user types, and
   a runtime with trimmed ICU data would group differently in the two passes and
   trip a hydration mismatch. */
export function group(n: number): string {
  const rounded = Math.round(Math.abs(n)).toString();
  return (
    (n < 0 ? "-" : "") + rounded.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}

export const naira = (n: number) => `₦${group(n)}`;

/* Digits only — strips the grouping commas a user may paste back in. */
export function digits(value: string, max = 99_999_999): number {
  const n = Number(value.replace(/\D/g, ""));
  if (!Number.isFinite(n)) return 0;
  return Math.min(n, max);
}
