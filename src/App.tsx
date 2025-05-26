import { ChatEvent, ChatLog, ChatMessage, toChatEvent, toChatLog, toChatMessage } from "#types";
import randomName from "@scaleway/random-name";
import "./index.css";

import { ChangeEvent, useEffect, useState } from "react";
// import useWebSocket, { ReadyState } from "react-use-websocket";
// to fix weird default function error
import { useWebSocket } from 'react-use-websocket/src/lib/use-websocket'
import { match } from "mutch";

const socketUrl = 'ws://127.0.0.1:4000'
const username = randomName()
type Typing = {
  username: string,
  lastInput: number
}

export const App = () => {
  const [text, setText] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [typing, setTyping] = useState<Typing[]>([])
  const { lastMessage, sendMessage } = useWebSocket(
    socketUrl,
    {
      onOpen: () => {
        console.log('WebSocket connection established.')
      },
      onClose: () => {
        console.log('WebSocket connection closed.')
      }
    }
  )



  useEffect(() => {
    lastMessage ?
      handleMessage(JSON.parse(lastMessage.data)) :
      undefined
  }, [lastMessage])

  // how to display and then timeout typing indicator?
  useEffect(() => {
    lastMessage ?
      handleMessage(JSON.parse(lastMessage.data)) :
      undefined
  }, [typing])



  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(toChatMessage(text, username))
    setText(_ => '')
  }

  // debounce this to 3 seconds
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    sendMessage(toChatLog({ lastInput: Date.now() }, username))
    setText(e.target.value)
  }

  const handleMessage = (data: ChatMessage | ChatEvent | ChatLog) => {
    if (data.type === 'message' || data.type === 'event') {
      setHistory(prev => prev.concat(data.content))
    } else {
      setTyping([
        ...typing,
        {
          username: data.username,
          lastInput: data.content.lastInput
        }
      ])
    }
  }


  const typingIndicator = (usersTyping: Typing[]) => {
    const users = usersTyping
      .filter(({ lastInput }) =>
        lastInput >= Date.now() - 5000
      )

    // rework mutch
    return match(users.length, [
      [, () => <p>Multiple people typing...</p>],
      [=== 1, () => <p>{users.pop()?.username} is typing...</p>],
    ],
      () => null
    )
  }

  // on typing send lastInput timestamp with username/id
  // show typing indicator if lastInputTimestamp >= Date.now() - 5000 
  return (
    <div className="app">
      {history.map(item => <p>{item}</p>)}
      <form onSubmit={handleSubmit}>
        {
          // typing.lastInput >= Date.now() - 5000 ?
          //   <p>{typing.username} is typing...</p> :
          //   null
        }
        <input
          onChange={handleChange}
          type="text"
          // className={styles.textbox}
          value={text}
        />
      </form>
    </div>
  )
}

export default App;
