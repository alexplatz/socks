import { serve } from "bun"

const server = serve({
  port: 4000,
  fetch: (req, server) => {
    if (!server.upgrade(req)) {
      return new Response("Upgrade failed", { status: 500 })
    }
  },
  websocket: {
    message: (_ws, message) => { console.log(message) },
    perMessageDeflate: true,
  },
})

console.log(`Websockets listening on ${server.hostname}:${server.port}`)
