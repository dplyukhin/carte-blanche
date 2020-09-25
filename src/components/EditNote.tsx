import React, { useRef } from 'react'
import { Action } from '../actions'
import { ID, Note } from '../model'
import { scrollToElement } from '../util'
import NoteEditor from './NoteEditor'

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

    return (
        <div className="card-panel z-depth-3 edited-note">
            <NoteEditor note={note} id={id} dispatch={dispatch} onKeyDown={onKeyDown} />
        </div>
    )
})