import { fromZonedTime } from "date-fns-tz";

export const DEFAULT_TIME_ZONE = "Africa/Lagos";

export function localDateTimeToUtc(value: string, timeZone = DEFAULT_TIME_ZONE) {
  const parsed = fromZonedTime(value, timeZone);
  if (!value || !Number.isFinite(parsed.getTime())) throw new Error("Choose a valid date and time.");
  return parsed;
}

export function formatPortalDateTime(value: string, timeZone = DEFAULT_TIME_ZONE) {
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short", timeZone }).format(new Date(value));
}
