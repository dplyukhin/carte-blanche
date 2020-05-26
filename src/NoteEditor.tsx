import React, { useMemo } from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { Note, ID } from './model'

type Props = { 
  note: Note, 
  id: ID, 
  updateNote: (id : ID, contents : string) => void,
  onKeyDown: (e: React.KeyboardEvent) => void
}
const NoteEditor = (props: Props) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  function onChange(value: Node[]) {
    props.updateNote(props.id, serialize(value))
  }

  return (
    <Slate editor={editor} value={deserialize(props.note.contents)} onChange={onChange}>
      <Editable autoFocus 
        onKeyDown={props.onKeyDown} 
        placeholder="Enter some text..." 
        style={{marginTop: '14px', marginBottom: '14px'}}
      />
    </Slate>
  )
}

// Define a serializing function that takes a value and returns a string.
const serialize = (value: Node[]) => {
  return (
    value
      // Return the string content of each paragraph in the value's children.
      .map(n => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join('\n')
  )
}

// Define a deserializing function that takes a string and returns a value.
const deserialize = (string: any): Node[] => {
  // Return a value array of children derived by splitting the string.
  return string.split('\n').map((line: string) => {
    return {
      children: [{ text: line }],
    }
  })
}

export default NoteEditor