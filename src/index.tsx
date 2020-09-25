import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import { State, Snapshot, DB_STRING } from './model';
import 'materialize-css/dist/js/materialize.min.js';
import 'katex/dist/katex.min.css';
import Dropbox, { AuthenticatedCloud } from './cloud';
import * as smoothscroll from 'seamless-scroll-polyfill';
import { Action } from './actions';
import App from './components/App';
smoothscroll.polyfill();


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


function render() {
  ReactDOM.render(
    <React.StrictMode>
      <App state={state} dispatch={dispatch} />
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