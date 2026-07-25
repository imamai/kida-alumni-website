export type EventCategory =
  | "agm"
  | "homecoming"
  | "reunion"
  | "networking"
  | "forum"
  | "county_meeting"
  | "international"
  | "other";

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: "agm", label: "AGM" },
  { value: "homecoming", label: "Homecoming" },
  { value: "reunion", label: "Reunion" },
  { value: "networking", label: "Networking" },
  { value: "forum", label: "Forum" },
  { value: "county_meeting", label: "County Meeting" },
  { value: "international", label: "International" },
  { value: "other", label: "Other" },
];
