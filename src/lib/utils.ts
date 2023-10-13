import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type MapKeys<T> = {
  [K in keyof T as SnakeToCamel<K & string>]: T[K]
}

type SnakeToCamel<S extends string> = S extends `${infer First}_${infer Rest}`
  ? `${Lowercase<First>}${Capitalize<SnakeToCamel<Rest>>}`
  : Lowercase<S>

export function snakeToCamel<T extends object>(obj: T): T {
  if (obj !== null && typeof obj === "object") {
    if (Array.isArray(obj)) {
      return obj.map((item) => snakeToCamel(item)) as T
    }

    const newObj: any = {}
    Object.keys(obj).forEach((key) => {
      const newKey = key.replace(/_./g, (match) =>
        match.charAt(1).toUpperCase()
      )
      //@ts-ignore
      newObj[newKey] = snakeToCamel(obj[key])
    })

    return newObj
  }

  return obj
}

export function formatTimestamp(timestamp: string): string {
  const currentDate = new Date()
  const parsedTimestamp = new Date(timestamp)

  const isSameDay =
    parsedTimestamp.getDate() === currentDate.getDate() &&
    parsedTimestamp.getMonth() === currentDate.getMonth() &&
    parsedTimestamp.getFullYear() === currentDate.getFullYear()

  const isYesterday = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - 1
  )

  if (isSameDay) {
    return (
      "Today at " +
      parsedTimestamp.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
      })
    )
  } else if (
    parsedTimestamp.getDate() === isYesterday.getDate() &&
    parsedTimestamp.getMonth() === isYesterday.getMonth() &&
    parsedTimestamp.getFullYear() === isYesterday.getFullYear()
  ) {
    return (
      "Yesterday at " +
      parsedTimestamp.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
      })
    )
  } else {
    return parsedTimestamp.toLocaleDateString([], {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }
}
