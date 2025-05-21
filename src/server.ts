import { serve } from "bun"

const server = serve({
  port: 4000,
  fetch: (req, server) => !server.upgrade(req) ?
    new Response("Upgrade failed", { status: 500 }) :
    undefined,
  websocket: {
    open: (ws) => {
      ws.subscribe('chat')
      server.publish('chat', 'new user has entered the chat')
    },
    message: (ws, message) => {
      ws.publish('chat', message)
      console.log(message)
    },
    close: (ws) => {
      ws.unsubscribe('chat')
      server.publish('chat', 'user has left the chat')
    },
    perMessageDeflate: true,
  },
})

console.log(`Websockets listening on ${server.hostname}:${server.port}`)
