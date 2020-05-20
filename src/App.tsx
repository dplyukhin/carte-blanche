import React from 'react';
import ReactMarkdown from 'react-markdown';
import logo from './logo.svg';
import './App.css';
import { State, Card, Note, Index } from './model';


type CardProps = { card: Card, state: State, isFocused: boolean, isSelected: boolean }

function Card({card, state, isFocused, isSelected}: CardProps): JSX.Element {
  if (card.type === 'index') {
    return (
      <div>
        {`Index: (${card.contents.length} cards)`}
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

function Editor(state: State): JSX.Element {
  const cards = state.currentIndex.contents.map(id => state.db[id])
  return (
    <div>
      {cards.map(function (card: Card, i: number) {
          const isFocused = state.focus === i
          const isSelected = state.mode === 'selecting' &&
            ((state.focus <= i && i <= state.selection!) ||
            (state.focus >= i && i >= state.selection!))

          return <Card card={card} state={state} isFocused={isFocused} isSelected={isSelected} />
      })}
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
