import { useInfiniteQuery } from "@tanstack/react-query"
import type { APIMessage } from "discord-api-types/v10"

export interface InfiniteData<TData> {
  pages: TData[]
  pageParams: unknown[]
}
type PaginatedMessages = {
  data: Array<APIMessage & { member: APIMessage["author"] & { nick: string } }>
  nextCursor: number
}
const fetchMessages = async ({
  channelId,
  page = 0,
}: {
  channelId: string
  page: number
}) => {
  //TODO: use proper envs
  const res = await fetch(
    `https://discord-go.onrender.com/api/channel?channelId=${channelId}&page=${
      page + 1
    }`
  )

  return res.json() as Promise<PaginatedMessages>
}

const useChatMessages = ({ channelId }: { channelId: string }) => {
  const infinite = useInfiniteQuery({
    queryKey: ["channel", channelId],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      fetchMessages({ channelId, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor !== 0 ? lastPage.nextCursor : null,
    select: (data) => {
      return data?.pages.flatMap((page) => {
        const data = page.data ?? []
        return data.sort((a, b) => {
          return +new Date(a.timestamp) - +new Date(b.timestamp)
        })
      })
    },
  })

  return infinite
}

export default useChatMessages
