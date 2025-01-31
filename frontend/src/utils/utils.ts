import { addDays } from "date-fns";
import { Priority } from "./color";

export function replaceItemAtIndex<T>(arr: T[], index: number, newValue: T) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}
export function removeItemAtIndex<T>(arr: T[], index: number): T[] {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export function createRangeArray(start: number, finish: number) {
  const rangeArray = [];

  if (start <= finish) {
    for (let i = start; i <= finish; i++) {
      rangeArray.push(i);
    }
  } else {
    for (let i = start; i >= finish; i--) {
      rangeArray.push(i);
    }
  }

  return rangeArray;
}

export function getShortName(
  user: { name: string } | null
): { shortName: string; firstName: string; lastName: string } | null {
  if (!user?.name) return null;

  const [firstName, lastName] = user.name.split(" ");

  if (firstName && lastName) {
    return {
      shortName: firstName[0] + lastName[0],
      firstName,
      lastName,
    };
  }

  return null;
}
/**
 * Converts hour, minute, and AM/PM components into a `Date` object set to today's date with the specified time.
 *
 * This function takes hour and minute values along with an AM/PM indicator and constructs a `Date` object
 * representing today's date with the specified time components. If the hour or minute is `null`, the function
 * returns `null`.
 *
 * @param hour - The hour component of the time, in the range 1-12. Can be `null`.
 * @param min - The minute component of the time, in the range 0-59. Can be `null`.
 * @param amPm - A string representing either "AM" or "PM" to indicate whether the time is in the morning or afternoon.
 * @returns A `Date` object set to today's date with the specified hour and minute, or `null` if hour or minute is `null`.
 */
export function convertTimeComponentsToDate(
  hour: number | null,
  min: number | null,
  amPm: string
) {
  if (!hour || !min) return null;
  const date = new Date();

  if (amPm === "PM" && hour !== 12) {
    hour += 12;
  }

  if (amPm === "AM" && hour === 12) {
    hour = 0;
  }

  date.setHours(hour);
  date.setMinutes(min);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

enum TokenType {
  Today,
  Tomorrow,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
  Reminder,
  Priority,
  Title,
}

type Token = {
  type: TokenType;
  value?: string;
};

type TitleConvertorTypes = {
  dueDate?: Date;
  title: string;
  reminder?: string;
  priority?: Priority;
};
// mon !

const isAlpha = (str: string) => /^[a-zA-Z]*$/.test(str); // charecters

const isWhiteSpace = (str: string) => /\s/g.test(str);

const isDigit = (str: string) => /[0-9]/.test(str);

const isPriority = (str: string) => /^p[1-4]$/.test(str);

function tockenizer(str: string): Token[] {
  const extractValue = (i: number): [string, number] => {
    let result = "";
    while (!isWhiteSpace(str[i]) && i < str.length) {
      result += str[i];
      i++;
    }
    return [result, i - 1]; // Return extracted value and adjusted index
  };
  const token: Token[] = [];
  let buff = "";
  for (let i = 0; i < str.length; i++) {
    const c = str[i];

    if (isAlpha(c)) {
      [buff, i] = extractValue(i);
      if (isPriority(buff)) {
        token.push({ type: TokenType.Priority, value: buff });
        buff = "";
        continue;
      }
      const PUSHINDEX = 2;
      switch (buff.toLocaleLowerCase()) {
        case "mon":
          if (isDigit(str[i + PUSHINDEX])) {
            [buff, i] = extractValue(i + PUSHINDEX);
            token.push({ type: TokenType.Monday, value: buff });
            continue;
          }
          token.push({ type: TokenType.Monday });
          buff = "";
          continue;
        case "tue":
          if (isDigit(str[i + PUSHINDEX])) {
            [buff, i] = extractValue(i + PUSHINDEX);
            token.push({ type: TokenType.Tuesday, value: buff });
            continue;
          }
          token.push({ type: TokenType.Tuesday });
          buff = "";
          continue;
        case "wed":
          if (isDigit(str[i + PUSHINDEX])) {
            [buff, i] = extractValue(i + PUSHINDEX);
            token.push({ type: TokenType.Wednesday, value: buff });
            continue;
          }
          token.push({ type: TokenType.Wednesday });
          buff = "";
          continue;
        case "thu":
          if (isDigit(str[i + PUSHINDEX])) {
            [buff, i] = extractValue(i + PUSHINDEX);
            token.push({ type: TokenType.Thursday, value: buff });
            continue;
          }
          token.push({ type: TokenType.Thursday });
          buff = "";
          continue;
        case "fri":
          if (isDigit(str[i + PUSHINDEX])) {
            [buff, i] = extractValue(i + PUSHINDEX);
            token.push({ type: TokenType.Friday, value: buff });
            continue;
          }
          token.push({ type: TokenType.Friday });
          buff = "";
          continue;
        case "tod":
          if (isDigit(str[i + PUSHINDEX])) {
            [buff, i] = extractValue(i + PUSHINDEX);
            token.push({ type: TokenType.Today, value: buff });
            continue;
          }
          token.push({ type: TokenType.Today });
          buff = "";
          continue;
        case "tom":
          if (isDigit(str[i + PUSHINDEX])) {
            [buff, i] = extractValue(i + PUSHINDEX);
            token.push({ type: TokenType.Tomorrow, value: buff });
            continue;
          }
          token.push({ type: TokenType.Tomorrow });
          buff = "";
          continue;
      }
    } else if (c === "!") {
      if (isDigit(str[i + 1])) {
        [buff, i] = extractValue(i + 1);
        const lowerDigibuff = buff.toLowerCase();
        if (lowerDigibuff.includes("am") || lowerDigibuff.includes("pm")) {
          token.push({ type: TokenType.Reminder, value: lowerDigibuff });
          buff = "";
          continue;
        }
      }
    } else if (isWhiteSpace(c)) {
      continue;
    }
    if (isAlpha(c) || isDigit(c)) {
      [buff, i] = extractValue(i);
      token.push({ type: TokenType.Title, value: buff });
      buff = "";
    }
  }
  return token;
}

function getAddDate(weekday: number) {
  let today = new Date().getDay();
  let i = 0;
  while (weekday !== today) {
    today = (today + 1) % 7;
    i++;
  }
  return i;
}

function tokenParser(token: Token[]) {
  const convertType: TitleConvertorTypes = { title: "" };
  token.forEach((token, i) => {
    switch (token.type) {
      case TokenType.Monday:
        convertType.dueDate = addDays(new Date(), getAddDate(1));
        break;

      default:
        break;
    }
  });
}

function titleConvertor(title: string) {
  const token = tockenizer(title);
}
