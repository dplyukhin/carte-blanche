import React from 'react';
import ReactMarkdown from 'react-markdown';
import Hotkeys from 'react-hot-keys';
import hotkeys from 'hotkeys-js';
import logo from './logo.svg';
import './App.css';
import { State, Card, Note, Index, Keypress, interpretKeypress, ID } from './model';

type NoteProps = { card: Card, id: ID }

type CardProps = { card: Card, id: ID, state: State, isFocused: boolean, isSelected: boolean }

function RenderCard({card, id, state, isFocused, isSelected}: CardProps): JSX.Element {
  if (card.type === 'index') {
    return (
      <div>
        {`Index: (${card.contents.length} cards)`}
      </div>
    )
  }
  else {

    if (isFocused && state.mode === 'editing') {
      return (
        <div>
          <ReactMarkdown source={card.contents} />
        </div>
      )
    }
    else {
      return (
        <div>
          <ReactMarkdown source={card.contents} />
        </div>
      )
    }
  }
}

function Editor({state}: {state: State}): JSX.Element {
  const cards = state.currentIndex.contents
  return (
    <div>
      {cards.map(function (id: ID, i: number) {
          const card = state.db[id]
          const isFocused = state.focus === i
          const isSelected = state.mode === 'selecting' &&
            ((state.focus <= i && i <= state.selection!) ||
            (state.focus >= i && i >= state.selection!))

          return <RenderCard id={id} card={card} state={state} isFocused={isFocused} isSelected={isSelected} />
      })}
    </div>
  )
}

const keymap : { [key: string] : Keypress} = {
  'Enter': 'enter',
  'command+c': 'copy',
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
const state = new State();

function handleKey(key: string, event: any){
  // Prevent the default refresh event under WINDOWS system
  event.preventDefault() 
  console.log(keymap[key]) 
  interpretKeypress(keymap[key], state);
  console.log(state)
}; 

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

export default App;
