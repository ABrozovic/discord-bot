import ReconnectingWebSocket, { type Message } from "reconnecting-websocket"

import type { WsJsonMessage } from "@/hooks/use-websocket"

import { snakeToCamel } from "./utils"

export class WebSocketManager {
  private socket: ReconnectingWebSocket | null = null
  private messageQueue: { [key: string]: Function[] | undefined } = {}
  private heartbeatInterval!: NodeJS.Timeout

  public constructor(websocketUrl: string) {
    this.socket = new ReconnectingWebSocket(websocketUrl, undefined, {
      debug: true,
      minReconnectionDelay: 3000,
    })

    this.socket.onopen = this.handleSocketOpen
    this.socket.onclose = this.handleSocketClose
    this.socket.onmessage = this.handleSocketMessage
  }

  public subscribe(arrkey: string[], callback: Function): void {
    const key = arrkey.join()

    if (!this.messageQueue[key]) {
      this.messageQueue[key] = []
    }

    this.messageQueue[key]?.push(callback)
  }

  public unsubscribe(arrkey: string[], callback: Function): void {
    const key = arrkey.join()

    if (!this.messageQueue[key]) {
      return
    }

    this.messageQueue[key] = this.messageQueue[key]?.filter(
      (cb) => cb !== callback
    )

    if (this.messageQueue[key]?.length === 0) {
      delete this.messageQueue[key]
    }
  }

  public unsubscribeAll(): void {
    this.messageQueue = {}
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }

    clearInterval(this.heartbeatInterval)
  }

  public send(message: Message): void {
    if (this.socket) {
      this.socket.send(message)
    }
  }

  private handleSocketOpen = () => {
    clearInterval(this.heartbeatInterval)
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ action: "heartbeat" }))
      }
    }, 55 * 1000)
  }

  private handleSocketClose = () => {
    clearInterval(this.heartbeatInterval)
  }

  private handleSocketMessage = (event: MessageEvent<any>) => {
    const data: WsJsonMessage = snakeToCamel<WsJsonMessage>(
      JSON.parse(event.data)
    )
    if (!data.message) return
    data.message = JSON.parse(data.message)

    const key = data.action
    if (this.messageQueue[key]) {
      this.messageQueue[key]?.forEach((callback) => {
        callback(data.message)
      })
    }
  }
}
