import { useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useBoundStore } from "@/store/slices"
import type { APIChannel, APIGuild } from "discord-api-types/v10"

import { useQueryWrapper } from "./use-query-wrapper"

export const useSlug = () => {
  const params = useParams()
  const guilds =
    useQueryWrapper<Record<string, APIGuild & { channels: APIChannel[] }>>(
      "getGuilds"
    )
  const setActiveChannel = useBoundStore((state) => state.zsetActiveChannel)
  const setActiveGuild = useBoundStore((state) => state.zsetActiveGuild)

  useEffect(() => {
    if (guilds.data && Array.isArray(params.slug) && params.slug?.length > 0) {
      const guildId = params.slug[0] ?? ""

      if (guildId in guilds.data) {
        setActiveGuild(guildId)
        if (params.slug?.length == 2) {
          const channelId = params.slug[1] ?? ""
          if (
            guilds.data[guildId]?.channels.find(
              (channel) => channel.id === channelId
            )
          ) {
            setActiveChannel(channelId)
          } else {
            setActiveChannel("")
          }
        } else {
          setActiveChannel("")
        }
      }
    }
  }, [params.slug, setActiveChannel, setActiveGuild, guilds])
}
