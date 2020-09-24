import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';
import RemarkMathPlugin from 'remark-math';
import RemarkHighlightPlugin from 'remark-highlight.js';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { BlockMath, InlineMath } from 'react-katex';
import Hotkeys from 'react-hot-keys';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import { State, Card, ID, Index, Note, Snapshot, DB_STRING, Mode } from './model';
import 'materialize-css/dist/js/materialize.min.js';
import 'katex/dist/katex.min.css';
import Dropbox, { AuthenticatedCloud } from './cloud';
import logo from './logo.jpeg';
import * as smoothscroll from 'seamless-scroll-polyfill';
import { Action } from './actions';
import SearchBar from './components/SearchBar';
import { scrollToElement } from './util';
import EditNote from './components/EditNote';
smoothscroll.polyfill();


type CardProps = { card: Card, id: ID, state: State, isFocused: boolean, isSelected: boolean, mode: Mode }
type PreviewProps = { card: Card, id: ID, state: State }



const MarkdownRenderers: ReactMarkdown.Renderers = {
  math: ({value}) => <BlockMath>{value}</BlockMath>,
  inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>,
  code: ({language, value}) => <SyntaxHighlighter language={language} style={docco}>{value}</SyntaxHighlighter>
}

const ViewNote = React.memo((
  props: { card: Note, id: ID, state: State, isFocused: boolean, isSelected: boolean }
): JSX.Element => {

  const ifFocused = props.isFocused ? "z-depth-3" : "";
  const ifSelected = props.isSelected ? "blue lighten-5" : "";
  const className = ["card-panel", ifFocused, ifSelected].join(" ");

  const ref: React.MutableRefObject<HTMLDivElement | null> = useRef(null)

  useEffect( () => {
    const el = ref.current
    if (el && props.isFocused) {
      console.log("Scrolling to", props.id);

      setTimeout(() => {
        scrollToElement(el)
      }, 20)
    }
  })

  return (
    <div className={className} ref={ref}>
      <ReactMarkdown 
        source={props.card.contents}
        plugins={[RemarkMathPlugin, RemarkHighlightPlugin]}
        renderers={MarkdownRenderers as any}
      />
    </div>
  )
})

const RenderCard = React.memo((props: CardProps): JSX.Element => {
  const {card, id, state, isFocused} = props;

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
        <EditNote note={card} id={id} dispatch={dispatch} />
      )
    }
    else {
      return (
        <ViewNote {...props} card={card} />
      )
    }
  }
})

const CardPreview = React.memo(({card, id, state}: PreviewProps): JSX.Element => {
  if (card.type === 'index') {
    return (
      <div className="card-panel truncate">
        {`Index: (${card.contents.length} cards)`}
      </div>
    )
  }
  else {
    const words = card.contents.split(" ");
    const preview = words.length > 20 
      ? words.slice(0,20).join(" ") + "..." 
      : card.contents;

    return (
      <div className="card-panel">
        <ReactMarkdown 
          source={preview}
          plugins={[RemarkMathPlugin, RemarkHighlightPlugin]}
          renderers={MarkdownRenderers as any}
        />
      </div>
    )
  }
})


function Editor({state}: {state: State | null}): JSX.Element {

  if (state === null) {
    return (
      <div className="row">
        <div className="col s3 offset-s4">
          <div className="card-panel valign-wrapper">
            <b className="center-align">Loading...</b>
          </div>
        </div>
      </div>
    )
  }

  const cards = state.currentIndex.contents
  const focusedID = cards[state.focus]
  const outgoing = state.db[focusedID + "-outgoing"] as Index | undefined
  const incoming = state.db[focusedID + "-incoming"] as Index | undefined

  return (
    <div className="row">
      <div id="left-panel" className="pinned col l3 offset-l1 m3 hide-on-small-only">
        <a href="/"><img id="logo" src={logo} alt="Go home" /></a>
        {incoming && incoming.contents.map(function (id: ID, i: number) {
            return <CardPreview key={i} card={state.db[id]} id={id} state={state} />
        })}
      </div>
      <div id="main-panel" className="col l4 offset-l4 m6 offset-m3 s10 offset-s1"> 
        <SearchBar dispatch={dispatch} />
        {
          Dropbox.isAuthenticated ||
          <div className="card-panel">
            <a href={Dropbox.authenticationURL}>Sign in to Dropbox</a>
          </div>  
        }
        {cards.map(function (id: ID, i: number) {
            const card = state.db[id]
            const isFocused = state.focus === i
            const isSelected = state.mode === 'selecting' &&
              ((state.focus <= i && i <= state.selection!) ||
              (state.focus >= i && i >= state.selection!))


            return <RenderCard id={id} card={card} key={i} state={state} isFocused={isFocused} isSelected={isSelected} mode={state.mode} />
        })}
      </div>
      <div id="right-panel" className="pinned col l3 offset-l8 m3 offset-m9 hide-on-small-only">
        {outgoing && outgoing.contents.map(function (id: ID, i: number) {
            return <CardPreview key={i} card={state.db[id]} id={id} state={state} />
        })}
      </div>
    </div>
  )
}

const normalModeKeymap : { [key: string] : Action} = {
  'Enter':           {type: 'edit'},
  'command+c':       {type: 'copy'},
  'command+x':       {type: 'cut'},
  'command+v':       {type: 'paste'},
  'command+z':       {type: 'undo'},
  'command+shift+z': {type: 'redo'},
  'Space':           {type: 'new note'},
  'right':           {type: 'right'},
  'left':            {type: 'left'},
  'up':              {type: 'up'},
  'down':            {type: 'down'},
  'Escape':          {type: 'back'},
  'Backspace':       {type: 'remove'},
  'shift+down':      {type: 'select and go down'},
  'shift+up':        {type: 'select and go up'},
  'shift+f':         {type: 'find related notes'},
  // VIM keybindings
  'j':               {type: 'down'},
  'k':               {type: 'up'},
  'h':               {type: 'left'},
  'l':               {type: 'right'},
  'shift+h':         {type: 'back'},
  'shift+l':         {type: 'forward'},
  'u':               {type: 'undo'},
  'ctrl+r':          {type: 'redo'},
  'y':               {type: 'copy'},
  'p':               {type: 'paste'},
  'x':               {type: 'cut'},
  'd':               {type: 'remove'},
  'i':               {type: 'edit'},
  'a':               {type: 'new note'},
}

const boundKeys = Object.keys(normalModeKeymap).join(",")

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



let state : State | null = null;

// Periodically upload state to Dropbox

if (Dropbox.isAuthenticated) {
  setInterval(() => {
    if (state !== null && state.dirty)
      (Dropbox as AuthenticatedCloud).upload(state)
  }, 10000)
}


// Initialize state, checking Dropbox and localStorage

(async function () {
  const cloudSnapshot = Dropbox.isAuthenticated ? await Dropbox.download() : null
  cloudSnapshot && console.log("Got cloud snapshot:", cloudSnapshot)

  const text = localStorage.getItem(DB_STRING)
  const localSnapshot = text ? JSON.parse(text) as Snapshot : null
  console.log("Got snapshot from localstorage:", localSnapshot)

  // No previous work found... Start in the initial state.
  if (localSnapshot === null && cloudSnapshot === null) {
    state = new State(null);
  }
  // Cloud backup found, with no local save. Must be logging in on a new browser or cleared the cache.
  else if (localSnapshot === null && cloudSnapshot !== null) {
    state = new State(cloudSnapshot);
  }
  // If a local copy is found with no cloud backup, then load that local state.
  else if (localSnapshot !== null && cloudSnapshot === null) {
    state = new State(localSnapshot);
  }
  // At this point we know that both a local snapshot and a cloud snapshot exist.
  // Load whichever one has the more recent time stamp.
  else {
    state = (localSnapshot!.timestamp < cloudSnapshot!.timestamp) 
      ? new State(cloudSnapshot) 
      : new State(localSnapshot);
  }

  render();

})()


function handleKey(key: string, event: any) {
  if (state) {
    // Prevent the default refresh event under WINDOWS system
    event.preventDefault() 
    console.log(normalModeKeymap[key]) 
    dispatch(normalModeKeymap[key])
  }
}; 



function render() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );  
}

window.onpopstate = function (e: PopStateEvent) {
  console.log("Entered index " + window.location.hash + " focus " + e.state.focus)
  if (state) {
    state.view(window.location.hash.slice(1), e.state.focus)
    render()
  }
}

function dispatch(action: Action) {
  if (state === null) return

  if (action.type === 'search') {
    state.search(action.query)
  }

  if (state.mode === 'viewing') {
      if (action.type === 'edit' && state.focus >= 0) {
          state.mode = 'editing'
      }
      else if (action.type === 'find related notes' && state.focus >= 0) {
          state.showRelatedNotes()
      }
      else if (action.type === 'back') {
          state.goBack()
      }
      else if (action.type === 'forward') {
          state.goForward()
      }
      else if (action.type === 'new note') {
          const note = state.newNote()
          state.insertAfter(state.focus, note)
          state.focus = state.focus + 1
          state.mode = 'editing'
      }
      else if (action.type === 'paste') {
          state.paste()
      }
      else if (action.type === 'right' && state.focus >= 0) {
          const note = state.currentIndex.contents[state.focus]
          state.enter(note + '-outgoing')
      }
      else if (action.type === 'left' && state.focus >= 0) {
          const note = state.currentIndex.contents[state.focus]
          state.enter(note + '-incoming')
      }
  }
  if (state.mode === 'viewing' || state.mode === 'selecting') {
      if (action.type === 'remove' && state.focus >= 0) {
          state.removeSelection()
      }
      else if (action.type === 'copy' && state.focus >= 0) {
          state.copy()
          state.mode = 'viewing'
          state.selection = undefined
      }
      else if (action.type === 'cut' && state.focus >= 0) {
          state.copy()
          state.removeSelection()
      }
      else if (action.type === 'back') {
          state.mode = 'viewing'
          state.selection = undefined
      }
      else if (action.type === 'up') {
          state.goUp()
      }
      else if (action.type === 'down') {
          state.goDown()
      }
      else if (action.type === 'select and go down' && state.focus >= 0) {
          state.mode = 'selecting'
          if (state.selection === undefined) {
              state.selection = state.focus
          }
          state.goDown()
      }
      else if (action.type === 'select and go up') {
          state.mode = 'selecting'
          if (state.selection === undefined) {
              state.selection = state.focus
          }
          state.goUp()
      }
  }
  if (state.mode === 'editing') {
      if (action.type === 'stop editing') {
          state.mode = 'viewing'
          state.save()
      }
      else if (action.type === 'update note') {
          const result = state.updateNote(action.id, action.contents)

          if (!result)
            console.error(`Cannot update card ${action.id}: not a note`)
      }
  }

  console.log(state)
  render()
}

render()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();