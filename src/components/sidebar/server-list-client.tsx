"use client"

import type { APIGuild } from "discord-api-types/v10"

import { useQueryWrapper } from "@/hooks/use-query-wrapper"

import ServerListItem from "./server-list-item"

const ServerList = () => {
  const serverList = useQueryWrapper<Record<string, APIGuild>>("getGuilds")

  return (
    <ul aria-label="servers" className="flex flex-col gap-2">
      {serverList.data &&
        Object.keys(serverList.data).map((guild) => {
          const guildKey = guild as keyof typeof serverList.data
          const curguild = serverList.data[guildKey]
          if (!curguild) return null
          return (
            <ServerListItem
              key={curguild.id}
              id={curguild.id}
              label={curguild.name}
              type="SERVER"
              src={
                curguild.icon
                  ? `https://cdn.discordapp.com/icons/${curguild.id}/${curguild.icon}.webp?size=96`
                  : ""
              }
            />
          )
        })}
    </ul>
  )
}

export default ServerList
