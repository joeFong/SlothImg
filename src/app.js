import React from 'react'
import ReactDOM from 'react-dom'
import SlothImg from '../src/SlothImg'

function App() {
  return (
    <>
     <SlothImg alt="one" datasrc="./images/large.jpg" datathumbnail="./images/small.jpg"></SlothImg>
    </>
  )
}
const node = document.createElement('div')
node.id = 'root'
document.body.appendChild(node)
const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)