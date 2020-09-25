import { Action } from "./actions"

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

export const boundKeys = Object.keys(normalModeKeymap).join(",")
  

export const handleKey = (dispatch: (a: Action) => void) => (key: string, event: any) => {
    // Prevent the default refresh event under WINDOWS system
    event.preventDefault() 
    console.log(normalModeKeymap[key]) 
    dispatch(normalModeKeymap[key])
}; 