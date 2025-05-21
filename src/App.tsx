import "./index.css";

import { ChangeEvent, useEffect, useState } from "react";
// import useWebSocket, { ReadyState } from "react-use-websocket";
// to fix weird default function error
import { useWebSocket } from 'react-use-websocket/src/lib/use-websocket'

const socketUrl = 'ws://127.0.0.1:4000'

export const App = () => {
  const [text, setText] = useState('')
  const [history, setHistory] = useState<string[]>([])
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

  useEffect(() => lastMessage ?
    setHistory(prev => prev.concat(lastMessage.data)) :
    undefined,
    [lastMessage]
  )

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(text)
    setHistory(prev => prev.concat(text))
    setText(_ => '')
  }

  return (
    <div className="app">
      {history.map(item => <p>{item}</p>)}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          // className={styles.textbox}
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </form>
    </div>
  )
}

export default App;
