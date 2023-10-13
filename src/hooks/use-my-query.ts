"use client"

import {
  useQuery,
  type QueryOptions,
  type UseQueryOptions,
} from "@tanstack/react-query"

export const useMyQuery = <T>(
  queryKey: string[],
  options?: UseQueryOptions<T>
) => {
  const query = useQuery({ queryKey, queryFn: () => fakeFunc<T>(), ...options })

  return query
}

export const fakeFunc = async <T>(): Promise<T> => {
  return {} as Promise<T>
}
