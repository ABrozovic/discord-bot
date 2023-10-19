"use client"

import { useMemo } from "react"
import { useBoundStore } from "@/store/slices"
import { useQueryClient } from "@tanstack/react-query"
import {
  ChannelType,
  type APIChannel,
  type APIGuild,
  type APIGuildCategoryChannel,
} from "discord-api-types/v10"
import { ChevronDown } from "lucide-react"

import { useQueryWrapper } from "@/hooks/use-query-wrapper"

import Icons from "../icons"
import { Typography } from "../typography"
import { ScrollArea } from "../ui/scroll-area"
import { ServerChannel } from "./server-channel"

const ServerInfo = () => {
  const queryClient = useQueryClient()
  const activeGuild = useBoundStore((state) => state.zactiveGuild)
  const guilds =
    useQueryWrapper<Record<string, APIGuild & { channels: APIChannel[] }>>(
      "getGuilds"
    )

  const channelCategories = useMemo(() => {
    if (!guilds || !guilds.data || !guilds.data[activeGuild]) return []

    const guild = guilds.data[activeGuild as string]
    const channelsByParentId: Record<string, APIChannel[]> = {}
    const categories: (APIGuildCategoryChannel & { channels: APIChannel[] })[] =
      []
    if (!guild) return
    const channelCount = guild.channels.length
    for (let i = 0; i < channelCount; i++) {
      const chan = guild.channels[i]
      if (!chan) continue
      if ("parent_id" in chan) {
        const parentId = chan.parent_id
        if (!parentId) continue

        if (channelsByParentId[parentId]) {
          channelsByParentId[parentId]?.push(chan)
        } else {
          channelsByParentId[parentId] = [chan]
        }
      }
    }

    for (let i = 0; i < channelCount; i++) {
      const chan = guild.channels[i]
      if (chan?.type === ChannelType.GuildCategory) {
        categories.push({
          ...chan,
          channels: channelsByParentId[chan.id] || [],
        })
      }
    }

    categories.sort((a, b) => a.position - b.position)
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i]
      if (Array.isArray(cat?.channels)) {
        cat?.channels.sort((a, b) => {
          if ("position" in a && "position" in b) {
            return a.position - b.position
          }
          return 0
        })
      }
    }

    return categories
  }, [guilds, activeGuild])

  const guild = guilds.data && guilds.data[activeGuild as string]

  const resetQuery = (channelId: string) => {
    console.log("ran")
    queryClient.invalidateQueries({ queryKey: ["channel", channelId] })
  }
  return (
    <div className="relative flex h-full w-60 flex-col bg-secondary">
      <ServerHeader label={guild?.name ?? ""} />
      <div className="relative flex flex-1">
        <div className="absolute flex h-full w-full flex-1 flex-col justify-start">
          <ScrollArea>
            <div className="w-60 truncate pr-2">
              {channelCategories?.map((category) => {
                const channels = category.channels.map((channel) => (
                  <ServerChannel
                    onClick={() => resetQuery(channel.id)}
                    key={channel.id}
                    id={channel.id}
                    label={channel.name ?? ""}
                  />
                ))
                return (
                  <ServerChannelHeader
                    key={category.id}
                    label={category.name ?? ""}
                  >
                    {channels}
                  </ServerChannelHeader>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
      <ServerHeader label={guild?.name ?? ""} />
    </div>
  )
}

export default ServerInfo

const ServerChannelHeader = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => {
  return (
    <ul aria-label="channels" className="w-full">
      <li className="pt-4">
        <div className="flex h-6 cursor-pointer items-center justify-between pl-4 pr-2">
          <div className="relative">
            <Typography as="h3" className="text-xs font-medium uppercase">
              {label}
            </Typography>
            <Icons.arrowDown className="absolute -left-3.5 top-0.5 h-3 w-3" />
          </div>
          <Icons.plus className="h-[18px] w-[18px]" />
        </div>
      </li>
      {children}
    </ul>
  )
}

const ServerHeader = ({ label }: { label: string }) => {
  return (
    <div className="relative flex h-12 w-full cursor-pointer items-center border-b-[1px] border-tertiary">
      <header className="w-full cursor-pointer px-4 py-3">
        <div className="flex flex-row items-center justify-between">
          <div className="flex w-full flex-row gap-1">
            <div className="relative flex items-center justify-center ">
              <Icons.flowerStar className="h-4 w-4 dark:text-slate-600 " />
              <Icons.boostedGuild className="absolute h-2.5 w-2.5 text-white" />
            </div>
            <Typography variant="p" as="h1" className="text-sm font-medium">
              {label}
            </Typography>
          </div>
          <ChevronDown className="h-5 w-5" />
        </div>
      </header>
    </div>
  )
}
