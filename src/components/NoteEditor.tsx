import React, { useMemo, useRef, useState } from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { Action } from '../actions'
import { ID, Note } from '../model'
import { scrollToElement } from '../util'

export type Props = {
    id: ID,
    note: Note,
    dispatch(action: Action): void,
}

export default React.memo((
    { note, id, dispatch }: Props
): JSX.Element => {

    const ref: React.MutableRefObject<HTMLTextAreaElement | null> = useRef(null)

    if (ref.current)
        scrollToElement(ref.current)

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Escape') {
            dispatch({ type: 'stop editing' })

        }
    }

    const [value, setValue] = useState<Node[]>(deserialize(note.contents))
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])

    function onChange(value: Node[]) {
        setValue(value)
        dispatch({ type: 'update note', id, contents: serialize(value) })
    }

    return (
        <div className="card-panel z-depth-3 edited-note">
            <Slate editor={editor} value={value} onChange={onChange}>
                <Editable autoFocus
                    onKeyDown={onKeyDown}
                    placeholder="Enter some text..."
                    style={{ marginTop: '14px', marginBottom: '14px' }}
                />
            </Slate>
        </div>
    )
})

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