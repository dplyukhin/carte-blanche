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
import { State, interpretKeypress, Card, Keypress, ID, Index, Note, Snapshot, DB_STRING, Mode } from './model';
import 'materialize-css/dist/js/materialize.min.js';
import 'katex/dist/katex.min.css';
import NoteEditor from './NoteEditor';
import Dropbox, { AuthenticatedCloud } from './cloud';
import logo from './logo.jpeg';


type CardProps = { card: Card, id: ID, state: State, isFocused: boolean, isSelected: boolean, mode: Mode }
type PreviewProps = { card: Card, id: ID, state: State }

function onKeyDown(e: React.KeyboardEvent) {
  if (state) {
    if (e.key === 'Escape') {
      state.mode = 'viewing'
      state.save()
      render()
    }
  }
}

function scrollToElement(el : HTMLElement) {
  el.scrollIntoView({behavior: "smooth", block: "center"})
}

function EditNote(
  props: { note: Note, id: ID }
): JSX.Element {

  const {note, id} = props
  const ref: React.MutableRefObject<HTMLTextAreaElement | null> = useRef(null)

  if (ref.current)
    scrollToElement(ref.current)

  return (
    <div className="card-panel z-depth-3 edited-note">
      <NoteEditor note={note} id={id} updateNote={updateNote} onKeyDown={onKeyDown} />
    </div>
  )
}

const MarkdownRenderers: ReactMarkdown.Renderers = {
  math: ({value}) => <BlockMath>{value}</BlockMath>,
  inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>,
  code: ({language, value}) => <SyntaxHighlighter language={language} style={docco}>{value}</SyntaxHighlighter>
}

function ViewNote(
  props: { card: Note, id: ID, state: State, isFocused: boolean, isSelected: boolean }
): JSX.Element {

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
}

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
        <EditNote note={card} id={id} />
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

function Search({state}: {state: State | null}): JSX.Element {
  const [query, setQuery] = useState("");
  const ref: React.MutableRefObject<HTMLInputElement | null> = useRef(null)

  function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    if (state) {
      state.search(query)
      render()
      if (ref.current) ref.current.blur()
    }
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      if (ref.current) ref.current.blur()
    }
  }

  return (
    <form className="input-field" onSubmit={onSubmit}>
      <i className="material-icons prefix">search</i>
      <input id="icon_prefix" type="text" ref={ref}
        onChange={ e => setQuery(e.target.value) } 
        onKeyDown={onKeyDown} />
      <label htmlFor="icon_prefix">Search</label>
    </form>
  )
}

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
        <Search state={state} />
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
  'Escape': 'back',
  'Backspace': 'backspace',
  'shift+down': 'shift+down',
  'shift+up': 'shift+up',
  // VIM keybindings
  'j': 'down',
  'k': 'up',
  'h': 'left',
  'l': 'right',
  'shift+h': 'back',
  'shift+l': 'forward',
  'u': 'undo',
  'ctrl+r': 'redo',
  'y': 'copy',
  'p': 'paste',
  'x': 'cut',
  'd': 'backspace',
  'i': 'enter',
  'a': 'space'
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
    console.log(keymap[key]) 
    interpretKeypress(keymap[key], state);
    console.log(state)
    render()
  }
}; 

function updateNote(id : ID, contents : string) {
  if (state) {
    if (state.updateNote(id, contents)) {
      render()
    }
    else {
      console.error(`Cannot update card ${id}: not a note`)
    }
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

window.onpopstate = function (e: PopStateEvent) {
  console.log("Entered index " + window.location.hash + " focus " + e.state.focus)
  if (state) {
    state.view(window.location.hash.slice(1), e.state.focus)
    render()
  }
}

render()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();