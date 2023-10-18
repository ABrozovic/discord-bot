import { useInfiniteQuery } from "@tanstack/react-query"
import type { APIMessage } from "discord-api-types/v10"

export interface InfiniteData<TData> {
  pages: TData[]
  pageParams: unknown[]
}
type PaginatedMessages = {
  data: APIMessage & { member: APIMessage["author"] & { nick: string } }
  nextCursor: number
}
const useChatMessages = ({ channelId }: { channelId: string }) => {
  const fetchMessages = async ({
    channelId,
    page = 0,
  }: {
    channelId: string
    page: number
  }) => {
    const res = await fetch(
      `http://localhost/api/channel?channelId=${channelId}&page=${page + 1}`
    )

    return res.json() as Promise<PaginatedMessages>
  }

  const infinite = useInfiniteQuery({
    queryKey: ["channel", channelId],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      fetchMessages({ channelId, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor !== 0 ? lastPage.nextCursor : null,
  })

  return infinite
}

export default useChatMessages
