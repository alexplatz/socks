import "./index.css";

import { ChangeEvent, useEffect, useState } from "react";
// import useWebSocket, { ReadyState } from "react-use-websocket";
// to fix weird default function error
import { useWebSocket } from 'react-use-websocket/src/lib/use-websocket'

const socketUrl = 'ws://127.0.0.1:4000'

export const App = () => {
  const [text, setText] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const { lastMessage, sendMessage, sendJsonMessage } = useWebSocket(
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
      // act on type, only add strings to history
      // setHistory(prev => prev.concat(lastMessage.data)) :
      parseMessage(lastMessage) :
      undefined
  }, [lastMessage])

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(text)
    // setHistory(prev => prev.concat(text))
    setText(_ => '')
  }

  // debounce this to 3 seconds
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    sendJsonMessage({ lastInput: Date.now() })
    setText(e.target.value)
  }

  // how to tell when regular string or json?
  const parseMessage = ({ data }: MessageEvent<string>) => {
    // console.log(typeof data, data)
    console.log(JSON.parse(data))
  }

  // on typing send lastInput timestamp with username/id
  // show typing indicator if lastInputTimestamp >= Date.now() - 5000 
  return (
    <div className="app">
      {history.map(item => <p>{item}</p>)}
      <form onSubmit={handleSubmit}>
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
