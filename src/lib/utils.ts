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
      newObj[newKey] = snakeToCamel(obj[key])
    })

    return newObj
  }

  return obj
}
