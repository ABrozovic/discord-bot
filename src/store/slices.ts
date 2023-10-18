import ReconnectingWebSocket from "reconnecting-websocket"
import { create, type StateCreator } from "zustand"
import { devtools } from "zustand/middleware"

import type { WebSocketManager } from "@/lib/ws-manager"

type WsSlice = {
  websocket: WebSocketManager | undefined
  setWebsocket: (ws: WebSocketManager) => void
  messageQueue: any[]
  setMessageQueue: (ev: any) => void
  removeByAction: (action: string) => void
}
type DiscordSlice = {
  activeGuild: string
  activeChannel: string
  setActiveGuild: (id: string) => void
  setActiveChannel: (id: string) => void
}

const createDiscordSlice: StateCreator<
  DiscordSlice & WsSlice,
  [["zustand/devtools", never]],
  [],
  DiscordSlice
> = (set) => ({
  activeGuild: "602887413819506700",
  activeChannel: "602892529997840399",
  setActiveChannel: (id) => set((state) => ({ ...state, activeChannel: id })),
  setActiveGuild: (id) => set((state) => ({ ...state, activeGuild: id })),
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
  setMessageQueue: (msg) =>
    set((state) => ({ ...state, messageQueue: [...state.messageQueue, msg] })),
  removeByAction: (action) =>
    set((state) => {
      const meh = state.messageQueue.filter((test) => test.action !== action)

      return { ...state, messageQueue: meh }
    }),
})

export const useBoundStore = create<WsSlice & DiscordSlice>()(
  devtools((...a) => ({
    ...createWsSlice(...a),
    ...createDiscordSlice(...a),
  }))
)
