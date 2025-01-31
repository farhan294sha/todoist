/**
 * Enum for defining text color classes for different priority levels.
 *
 * Each priority level corresponds to a specific text color class
 * used for styling in the application.
 */
enum PriorityColor {
  p4 = "text-grey-500",
  p3 = "text-blue-500",
  p2 = "text-orange-400",
  p1 = "text-red-500",
}
/**
 * Enum for representing priority levels.
 *
 * This enum provides numeric identifiers for different priority levels,
 * which can be used to index into the `PriorityColor` enum to get the
 * corresponding color class.
 */
export enum Priority {
  p4,
  p3,
  p2,
  p1,
}
/**
 * Enum for defining text color classes based on the date status.
 *
 * Each date status (e.g., overdue, today, tomorrow, within a week)
 * has a corresponding text color class for styling purposes.
 */
export enum DateColor {
  overDue = "text-red-600",
  today = "text-green-600",
  tomorrow = "text-red-600",
  oneWeek = "text-purple-600",
}
/**
 * Retrieves the text color class and hover color class for a given priority.
 *
 * This function takes a priority level as input and returns an object
 * containing the text color class (`pColor`) and hover color class (`hColur`).
 * The hover color class is derived by replacing "500" with "600" in the base
 * text color class to provide a darker shade for hover effects.
 *
 * @param priority - The numeric priority level, represented by the `Priority` enum.
 * @returns An object containing:
 * - `pColor`: The text color class for the given priority.
 * - `hColur`: The hover color class for the given priority.
 */
export const getPriorityColor = (priority: number) => {
  const priorityKey = Priority[priority];
  const pColor: string =
    PriorityColor[priorityKey as keyof typeof PriorityColor];
  const hColor: string = pColor.replace("600", "700");
  return { pColor, hColor };
};
/**
 * Determines the appropriate text color class for a given due date based on its proximity to the current date.
 *
 * This function returns a color class string that indicates whether the due date is overdue, today, tomorrow,
 * within one week, or beyond one week. If the due date is `null` or `undefined`, a default muted color is returned.
 *
 * @param dueDate - A string representing the due date in a format recognized by the JavaScript `Date` constructor
 *                  (e.g., ISO 8601 format), or `null` if no due date is provided.
 * @returns A string representing the CSS class for the text color based on the due date's proximity to the current date.
 *          - `DateColor.overDue` for overdue dates.
 *          - `DateColor.today` for today's date.
 *          - `DateColor.tomorrow` for tomorrow's date.
 *          - `DateColor.oneWeek` for dates within one week.
 *          - `"text-muted-foreground"` for dates beyond one week or if the input is `null` or `undefined`.
 */
export function getDateColor(dueDate: string | null): string {
  if (dueDate === null || dueDate === undefined) {
    return "text-muted-foreground";
  }

  const dueDateObj = new Date(dueDate);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  dueDateObj.setHours(0, 0, 0, 0);

  const diffInMilliseconds = dueDateObj.getTime() - currentDate.getTime();
  const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

  if (diffInDays < 0) {
    return DateColor.overDue;
  } else if (diffInDays === 0) {
    return DateColor.today;
  } else if (diffInDays === 1) {
    return DateColor.tomorrow;
  } else if (diffInDays <= 7) {
    return DateColor.oneWeek;
  } else {
    return "text-muted-foreground";
  }
}
