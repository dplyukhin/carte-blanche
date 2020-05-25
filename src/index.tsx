import React from 'react';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';
import Hotkeys from 'react-hot-keys';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import { State, interpretKeypress, Card, Keypress, ID } from './model';
import 'materialize-css/dist/js/materialize.min.js';



type CardProps = { card: Card, id: ID, state: State, isFocused: boolean, isSelected: boolean }

function onKeyDown(e: React.KeyboardEvent) {
  if (e.key === 'Escape') {
    state.mode = 'viewing'
    render()
  }
}

function RenderCard({card, id, state, isFocused, isSelected}: CardProps): JSX.Element {
  if (card.type === 'index') {
    return (
      <div>
        {`Index: (${card.contents.length} cards)`}
      </div>
    )
  }
  else {
    const ifFocused = isFocused ? "z-depth-3" : "";
    const ifSelected = isSelected ? "blue lighten-5" : "";
    const className = ["card-panel", ifFocused, ifSelected].join(" ");

    if (isFocused && state.mode === 'editing') {
      return (
        <textarea autoFocus 
          className={ifFocused}
          value={card.contents} 
          onChange={e => updateNote(id, e.target.value)} 
          onKeyDown={onKeyDown}
        />
      )
    }
    else {
      return (
        <div className={className}>
          <ReactMarkdown source={card.contents} />
        </div>
      )
    }
  }
}

function Editor({state}: {state: State}): JSX.Element {
  const cards = state.currentIndex.contents
  return (
    <div className="row">
      <div className="pinned col s3 offset-s1">
      </div>
      <div className="col s4 offset-s4">
        {cards.map(function (id: ID, i: number) {
            const card = state.db[id]
            const isFocused = state.focus === i
            const isSelected = state.mode === 'selecting' &&
              ((state.focus <= i && i <= state.selection!) ||
              (state.focus >= i && i >= state.selection!))

            if (isSelected)
              console.log("Selected", i)

            return <RenderCard id={id} card={card} key={i} state={state} isFocused={isFocused} isSelected={isSelected} />
        })}
      </div>
      <div className="pinned col s3 offset-s8">
        <div className="card-panel truncate">
          <span>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has
            survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of
            Lorem Ipsum. Why do we use it?
          </span>
        </div>
      </div>
    </div>
  )
}

const keymap : { [key: string] : Keypress} = {
  'Enter': 'enter',
  'command+c': 'copy',
  'command+x': 'cut',
  'command+v': 'paste',
  'command+z': 'undo',
  'command+shift+z': 'redo',
  'Space': 'space',
  'right': 'right',
  'left': 'left',
  'up': 'up',
  'down': 'down',
  'Escape': 'escape',
  'Backspace': 'backspace',
  'shift+down': 'shift+down',
  'shift+up': 'shift+up',
  // VIM keybindings
  'j': 'down',
  'k': 'up',
  'h': 'left',
  'l': 'right',
  'u': 'undo',
  'ctrl+r': 'redo',
  'y': 'copy',
  'p': 'paste'
}

const boundKeys = Object.keys(keymap).join(",")

function App() {
  return (
    <Hotkeys
      keyName={boundKeys}
      onKeyDown={handleKey}
    >
      <Editor state={state}/>
    </Hotkeys>
  );
}



const state = new State();

function handleKey(key: string, event: any){
  // Prevent the default refresh event under WINDOWS system
  event.preventDefault() 
  console.log(keymap[key]) 
  interpretKeypress(keymap[key], state);
  console.log(state)
  render()
}; 

function updateNote(id : ID, contents : string) {
  const note = state.db[id]
  if (note.type === 'note') {
    note.contents = contents
    render()
  }
  else {
    throw Error(`Cannot update card ${id}: not a note`)
  }
}

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );  
}

render()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
