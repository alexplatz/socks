import { serve } from "bun"
import randomName from "@scaleway/random-name"

const server = serve<{ username: string }, {}>({
  port: 4000,
  fetch: (req, server) =>
    !server.upgrade(req, {
      data: {
        username: randomName()
      }
    }) ?
      new Response("Upgrade failed", { status: 500 }) :
      undefined,
  websocket: {
    open: (ws) => {
      ws.subscribe('chat')
      server.publish('chat', JSON.stringify({ message: 'new user has entered the chat' }))
    },
    message: (ws, message) => {
      // distinguish between message and event
      // parse, don't validate?
      // I think this needs to be a try/catch :/
      server.publish('chat', JSON.stringify({
        username: ws.data.username,
        message
      }))
      console.log(typeof message, message)
    },
    close: (ws) => {
      ws.unsubscribe('chat')
      server.publish('chat', JSON.stringify({ message: 'user has left the chat' }))
    },
    perMessageDeflate: true,
  },
})

console.log(`Websockets listening on ${server.hostname}:${server.port}`)
