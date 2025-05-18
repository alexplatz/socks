import "./index.css";

import React, { ChangeEvent, useEffect, useState } from "react";
// import useWebSocket, { ReadyState } from "react-use-websocket";
// to fix weird default function error
import { useWebSocket } from 'react-use-websocket/src/lib/use-websocket'

const socketUrl = 'ws://127.0.0.1:4000'

export const App = () => { 
  const [text, setText] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const { sendMessage } = useWebSocket(
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

  // useEffect(() => console.log(ReadyState))

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(text)
    console.log(text)
    setHistory(prevHistory => prevHistory.concat(text))
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
