import { ChatEvent, ChatLog, ChatMessage, toChatLog, toChatMessage } from "#types";
import randomName from "@scaleway/random-name";
import "./index.css";

import { ChangeEvent, useEffect, useState } from "react";
// import useWebSocket, { ReadyState } from "react-use-websocket";
// to fix weird default function error
import { useWebSocket } from 'react-use-websocket/src/lib/use-websocket'
import { match } from "mutch";

const socketUrl = 'ws://127.0.0.1:4000'
const username = randomName()

export const App = () => {
  const [text, setText] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [typing, setTyping] = useState<Map<string, number>>(new Map<string, number>())
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



  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(toChatMessage(text, username))
    setText(_ => '')
  }

  // debounce this to 3 seconds
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.value) {
      sendMessage(toChatLog({ lastInput: Date.now() }, username))
      setText(e.target.value)
    } else {
      sendMessage(toChatLog({ lastInput: null }, username))
      setText(e.target.value)
    }
  }

  const handleMessage = (data: ChatMessage | ChatEvent | ChatLog) => {
    if (data.type === 'message') {
      setHistory(prev => prev.concat(data.content))
      stopTyping(data.username)
    } else if (data.type === 'event') {
      setHistory(prev => prev.concat(data.content))
    } else {
      if (data.content.lastInput) {
        setTyping(prev => new Map(prev).set(data.username, data.content.lastInput))
      } else {
        clearTimeout(typing.get(data.username))
        stopTyping(data.username)
      }
    }
  }

  const stopTyping = (username: string) => {
    setTyping(prev => {
      prev.delete(username)
      return new Map(prev)
    })
  }


  return (
    <div className="app">
      {history.map(item => <p>{item}</p>)}
      <form onSubmit={handleSubmit}>
        {
          match(
            typing.size,
            [
              [0, () => null],
              [1, () => <p>{typing.keys().next().value} is typing...</p>],
            ],
            () => <p>multiple people typing...</p>
          )
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
