import { v4 as uuid } from 'uuid';

export type ID = string
export type Card = Note | Index

export type Note = {
    type: "note",
    contents: string
}

export type Index = {
    type: "index",
    contents: ID[]
}

type Database = { [key: string]: Card }

type Breadcrumbs = [ID, number][]

export type Keypress 
    = 'enter' | 'escape' | 'space' | 'shift+space' | 'backspace'
    | 'left' | 'right' | 'up' | 'down' 
    | 'copy' | 'paste' | 'undo' | 'redo'
    | 'shift+down' | 'shift+up'

export function interpretKeypress(key: Keypress, state: State) {
    if (state.mode === 'viewing') {
        if (key === 'enter') {
            state.mode = 'editing'
        }
        else if (key === 'escape') {
            state.exit()
        }
        else if (key === 'space') {
            const note = state.newNote()
            state.insertAfter(state.focus, note)
            state.focus = state.focus + 1
            state.mode = 'editing'
        }
        else if (key === 'shift+space') {
            const index = state.newIndex()
            state.insertAfter(state.focus, index)
            state.focus = state.focus + 1
            state.enter(state.focusedCardID!)
        }
        else if (key === 'paste') {
            state.paste()
        }
    }
    if (state.mode === 'viewing' || state.mode === 'selecting') {
        if (key === 'backspace' && state.focus >= 0) {
            state.deleteSelection()
        }
        else if (key === 'copy' && state.focus >= 0) {
            state.copy()
        }
        else if (key === 'up') {
            state.goUp()
        }
        else if (key === 'down') {
            state.goDown()
        }
        else if (key === 'shift+down' && state.focus >= 0) {
            state.mode = 'selecting'
            state.goDown()
        }
        else if (key === 'shift+up') {
            state.mode = 'selecting'
            state.goUp()
        }
    }
    if (state.mode === 'editing') {
        if (key === 'escape') {
            state.mode = 'viewing'
        }
    }
}

export class State {
    // Persistent state
    db: Database
    root: ID

    // Temporary state
    crumbs: Breadcrumbs
    mode: 'viewing' | 'editing' | 'selecting'
    clipboard: ID[]
    selection?: number

    constructor() {
        this.root = uuid()
        this.db = {}
        this.db[this.root] = { type: 'index', contents: [] }

        this.crumbs = [[this.root, -1]]
        this.mode = 'viewing'
        this.clipboard = []
    }

    get focus(): number {
        return this.crumbs[this.crumbs.length - 1][1]
    }
    set focus(focus: number) {
        this.crumbs[this.crumbs.length - 1][1] = focus
    }
    get currentIndexID(): ID {
        return this.crumbs[this.crumbs.length - 1][0]
    }
    get currentIndex(): Index {
        return this.db[this.currentIndexID] as Index
    }
    get focusedCardID(): ID | undefined {
        // This is undefined when the focus is -1
        return this.currentIndex.contents[this.focus]
    }
    get focusedCard(): Card | undefined {
        // This is undefined when the focus is -1
        return this.focusedCardID ? this.db[this.focusedCardID] : undefined
    }

    // NAVIGATION

    enter(id: ID) {
        this.crumbs.push([id, -1])
    }
    exit() {
        if (this.crumbs.length > 1) {
            this.crumbs.pop()
        }
    }
    goUp() {
        // The behavior in 'selecting' mode and 'viewing' mode is
        // slightly different: when selecting, you cannot move the
        // focus any higher than 0.
        if (this.mode === 'viewing') {
            if (this.focus > -1) {
                this.focus = this.focus - 1
            }
        }
        if (this.mode === 'selecting') {
            if (this.focus > 0) {
                this.focus = this.focus - 1
            }
        }
    }
    goDown() {
        if (this.focus < this.currentIndex.contents.length - 1) {
            this.focus = this.focus + 1
        }
    }

    // MUTATION

    insertAfter(focus: number, id: ID) {
        this.currentIndex.contents.splice(focus + 1, 0, id)
    }
    newNote(): ID {
        const id = uuid()
        this.db[id] = {type: 'note', contents: ""}
        return id
    }
    newIndex(): ID {
        const id = uuid()
        this.db[id] = {type: 'index', contents: []}
        return id
    }
    deleteSelection() {
        if (this.mode === 'viewing') {
            this.currentIndex.contents.splice(this.focus, 1)
        }
        else if (this.mode === 'selecting') {
            const lower = Math.min(this.focus, this.selection!)
            const upper = Math.max(this.focus, this.selection!)
            this.currentIndex.contents.splice(lower, upper - lower + 1)
            this.mode = 'viewing'
            this.focus = lower
        }
        // Update the focus if it's now out of bounds
        if (this.focus > this.currentIndex.contents.length - 1) {
            this.focus = this.focus - 1
        }
    }
    copy() {
        if (this.mode === 'viewing') {
            this.clipboard = [this.focusedCardID!]
        }
        else if (this.mode === 'selecting') {
            const index = this.currentIndex
            const lower = Math.min(this.focus, this.selection!)
            const upper = Math.max(this.focus, this.selection!)
            this.clipboard = []
            for (let i = lower; i <= upper; i++) {
                this.clipboard.push(index.contents[i])
            }
            this.mode = 'viewing'
        }
    }
    paste() {
        for (let i = 0; i < this.clipboard.length; i++) {
            this.insertAfter(this.focus + i, this.clipboard[i])
        }
    }

}