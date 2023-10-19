import { create, type StateCreator } from "zustand"
import { devtools } from "zustand/middleware"

import type { WebSocketManager } from "@/lib/ws-manager"

type WsSlice = {
  websocket: WebSocketManager | undefined
  setWebsocket: (ws: WebSocketManager) => void
}
type DiscordSlice = {
  zactiveGuild: string
  zactiveChannel: string
  zsetActiveGuild: (id: string) => void
  zsetActiveChannel: (id: string) => void
}

const createDiscordSlice: StateCreator<
  DiscordSlice & WsSlice,
  [["zustand/devtools", never]],
  [],
  DiscordSlice
> = (set) => ({
  zactiveGuild: "602887413819506700",
  zactiveChannel: "602892529997840399",
  zsetActiveChannel: (id) => set((state) => ({ ...state, zactiveChannel: id })),
  zsetActiveGuild: (id) => set((state) => ({ ...state, zactiveGuild: id })),
})

const createWsSlice: StateCreator<
  WsSlice & DiscordSlice,
  [["zustand/devtools", never]],
  [],
  WsSlice
> = (set) => ({
  websocket: undefined,
  setWebsocket: (ws) => set((state) => ({ ...state, websocket: ws })),
  messageQueue: [],
})

export const useBoundStore = create<WsSlice & DiscordSlice>()(
  devtools(
    (...a) => ({
      ...createWsSlice(...a),
      ...createDiscordSlice(...a),
    }),
    { name: "bearStore" }
  )
)
