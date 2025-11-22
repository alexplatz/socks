import { serve } from "bun"
import randomName from "@scaleway/random-name"
import { toChatEvent } from "#types"

const server = serve<{ username: string }, {}>({
  port: 4000,
  fetch: (req, server) =>
    !server.upgrade(req, {
      // data: {
      //   username: randomName()
      // }
    }) ?
      new Response("Upgrade failed", { status: 500 }) :
      undefined,
  websocket: {
    open: (ws) => {
      ws.subscribe('chat')
      server.publish(
        'chat',
        toChatEvent('new user has entered the chat')
      )
    },
    // check type
    message: (_ws, message: string) => {
      server.publish(
        'chat',
        message
      )
      console.log(message)
    },
    close: (ws) => {
      ws.unsubscribe('chat')
      server.publish(
        'chat',
        toChatEvent('user has left the chat')
      )
    },
    perMessageDeflate: true,
  },
})

console.log(`Websockets listening on ${server.hostname}:${server.port}`)
