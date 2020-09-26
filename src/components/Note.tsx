import React from "react"
import { Action } from "../actions"
import { ID, Mode, Note } from "../model"
import EditNote from "./NoteEditor"
import ViewNote from "./NoteViewer"


type Props = {
    id: ID,
    card: Note,
    position: number,
    focus: number,
    selection?: number,
    mode: Mode,
    dispatch(action: Action): void
}

export default React.memo((
    { id, card, position, focus, selection, mode, dispatch }: Props
): JSX.Element => {

    const isFocused = focus === position
    const isSelected = mode === 'selecting' &&
        ((focus <= position && position <= selection!) ||
            (focus >= position && position >= selection!))

    if (isFocused && mode === 'editing') {
        return (
            <EditNote note={card} id={id} dispatch={dispatch} />
        )
    }
    else {
        return (
            <ViewNote 
                card={card} id={id} position={position}
                isFocused={isFocused} isSelected={isSelected} />
        )
    }
})