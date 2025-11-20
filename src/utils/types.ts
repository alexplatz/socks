export type ChatEvent = {
  type: 'event'
  content: string
}

export type ChatMessage = {
  type: 'message',
  username: string
  content: string,
}

export type ChatLog = {
  type: 'log',
  username: string,
  content: {
    lastInput: number
  }
}

export const toChatEvent = (content: (string | Buffer<ArrayBufferLike>)) =>
  JSON.stringify({
    type: 'event',
    content
  })

export const toChatMessage = (content: (string | Buffer<ArrayBufferLike>), username: string) =>
  JSON.stringify({
    type: 'message',
    username,
    content
  })

export const toChatLog = (content: (string | Buffer<ArrayBufferLike>) | object, username: string) =>
  JSON.stringify({
    type: 'log',
    username,
    content
  })
