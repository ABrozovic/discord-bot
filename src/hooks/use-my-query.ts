"use client"

import { useQuery } from "@tanstack/react-query"

export const useMyQuery = <T>(queryKey: string[]) => {
  const query = useQuery({ queryKey, queryFn: () => fakeFunc<T>() })

  return query
}

export const fakeFunc = async <T>(): Promise<T> => {
  return {} as Promise<T>
}
