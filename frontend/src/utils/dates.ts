/**
 * Formats a given date string into a human-readable format.
 *
 * Depending on how far the given date is from today's date, the function
 * returns a string indicating "Today", "Tomorrow", the day of the week if
 * within the current week, or a formatted date string (e.g., "10 Jul") for dates
 * outside the current week.
 *
 * @param date - The date string to format. This should be in a format recognized
 *               by the JavaScript `Date` constructor (e.g., ISO 8601 format).
 * @returns A formatted string representing the date relative to today's date,
 *          or `null` if the input date string is empty or invalid.
 */
export function formatDate(date: string): string | null {
  if (!date) return null;

  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);


  const diffInMilliseconds = dateObj.getTime() - today.getTime();
  const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

  if (diffInDays >= 0 && diffInDays < 1) {
    return "Today";
  } else if (diffInDays >= 1 && diffInDays < 2) {
    return "Tomorrow";
  } else if (diffInDays >= 2 && diffInDays <= 7) {
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
      dateObj
    );
  } else {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
    }).format(dateObj);
  }
}

export function formatDateWithDay(): string {
  const date = new Date();

  // Get day of the month (e.g., 9)
  const dayOfMonth = date.getDate();

  // Get month name (e.g., Sep)
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);

  // Get day of the week (e.g., Monday)
  const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);

  // Get today’s label (e.g., Today or Yesterday)
  const today = new Date();
  const isToday = today.toDateString() === date.toDateString();
  const todayLabel = isToday ? 'Today' : dayOfWeek;

  // Format: "9 Sep ‧ Today ‧ Monday"
  return `${dayOfMonth} ${monthName} ‧ ${todayLabel} ‧ ${dayOfWeek}`;
}

export function formatTime(date: string) {
  const dateObj = new Date(date);
  const timeArr = dateObj.toTimeString().split(" ")[0].split(":");
  timeArr.pop();
  return timeArr.join(":");
}
/**
 * Checks if the given date string includes a time component.
 *
 * This function parses a date string and checks if the resulting date object
 * has non-zero hours, minutes, or seconds. If all are zero, it is assumed
 * that the date string does not include a specific time.
 *
 * @param date - The date string to check. This should be in a format recognized
 *               by the JavaScript `Date` constructor (e.g., ISO 8601 format).
 * @returns `true` if the date includes a time component (i.e., hours, minutes, or seconds are non-zero);
 *          otherwise, `false`.
 */
export function hasTime(date: string) {
  const dateObj = new Date(date);

  const localHours = dateObj.getHours();
  const localMinutes = dateObj.getMinutes();
  const localSeconds = dateObj.getSeconds();

  return !(localHours === 0 && localMinutes === 0 && localSeconds === 0);
}

/**
 * Returns the abbreviated weekday name for a given date.
 *
 * Uses the specified locale to format the date and return the abbreviated
 * weekday name (e.g., "Mon", "Tue").
 *
 * @param date - The `Date` object for which to get the abbreviated weekday name.
 * @param locale - An optional locale string to determine the format of the weekday.
 *                 Defaults to 'en-US'.
 * @returns The abbreviated weekday name as a string, according to the specified locale.
 */
export const getShortWeekday = (date: Date, locale: string = 'en-US'): string => {
  return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
};
