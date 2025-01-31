import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function safeAwait<T, E = Error>(promise: Promise<T>): Promise<[null, T] | [E, null]> {
  try {
    const result = await promise;
    return [null, result]
  } catch (error) {
    return [error as E, null]
  }
}
