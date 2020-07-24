import React, { useRef, useEffect } from 'react';
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
import { State, interpretKeypress, Card, Keypress, ID, Index, Note, Snapshot, DB_STRING } from './model';
import 'materialize-css/dist/js/materialize.min.js';
import 'katex/dist/katex.min.css';
import NoteEditor from './NoteEditor';
import Dropbox, { AuthenticatedCloud } from './cloud';



type CardProps = { card: Card, id: ID, state: State, isFocused: boolean, isSelected: boolean }
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
    if (ref.current && props.isFocused) {
      console.log("Scrolling to", props.id)
      setTimeout(() => {
        scrollToElement(ref.current!)
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

function RenderCard(props: CardProps): JSX.Element {
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
}

function CardPreview({card, id, state}: PreviewProps): JSX.Element {
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
      <div className="pinned col l3 offset-l1 m3 hide-on-small-only">
        {incoming && incoming.contents.map(function (id: ID, i: number) {
            return <CardPreview key={i} card={state.db[id]} id={id} state={state} />
        })}
      </div>
      <div className="col l4 offset-l4 m6 offset-m3 s10 offset-s1" style={{marginBottom: "20em"}}> 
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


            return <RenderCard id={id} card={card} key={i} state={state} isFocused={isFocused} isSelected={isSelected} />
        })}
      </div>
      <div className="pinned col l3 offset-l8 m3 offset-m9 hide-on-small-only">
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

  if (localSnapshot === null && cloudSnapshot === null) {
    state = new State(null);
  }
  else if (cloudSnapshot === null) {
    state = new State(localSnapshot);
  }
  else if (localSnapshot === null || localSnapshot.timestamp < cloudSnapshot.timestamp) {
    state = new State(cloudSnapshot);
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
    const note = state.db[id]
    if (note.type === 'note') {
      note.contents = contents
      render()
    }
    else {
      throw Error(`Cannot update card ${id}: not a note`)
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

render()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
