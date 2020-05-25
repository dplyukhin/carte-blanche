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
    | 'copy' | 'paste' | 'cut' | 'undo' | 'redo'
    | 'shift+down' | 'shift+up'

export function interpretKeypress(key: Keypress, state: State) {
    if (state.mode === 'viewing') {
        if (key === 'enter' && state.focus >= 0) {
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
        // else if (key === 'shift+space') {
        //     const index = state.newIndex()
        //     state.insertAfter(state.focus, index)
        //     state.focus = state.focus + 1
        //     state.enter(state.focusedCardID!)
        // }
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
            state.mode = 'viewing'
            state.selection = undefined
        }
        else if (key === 'cut' && state.focus >= 0) {
            state.copy()
            state.deleteSelection()
        }
        else if (key === 'escape') {
            state.mode = 'viewing'
            state.selection = undefined
        }
        else if (key === 'up') {
            state.goUp()
        }
        else if (key === 'down') {
            state.goDown()
        }
        else if (key === 'shift+down' && state.focus >= 0) {
            state.mode = 'selecting'
            if (state.selection === undefined) {
                state.selection = state.focus
            }
            state.goDown()
        }
        else if (key === 'shift+up') {
            state.mode = 'selecting'
            if (state.selection === undefined) {
                state.selection = state.focus
            }
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

        // If this note is added to the outgoing links of another
        // note, then add the latter to the *incoming* links of the former.
        const indexID = this.currentIndexID;
        if (indexID.endsWith("-outgoing")) {
            const note : ID = indexID.substr(0, indexID.length - 9)
            const incomingIndex = this.db[id + "-incoming"] as Index
            incomingIndex.contents.push(note)
        }
        if (indexID.endsWith("-incoming")) {
            const note : ID = indexID.substr(0, indexID.length - 9)
            const outgoingIndex = this.db[id + "-outgoing"] as Index
            outgoingIndex.contents.push(note)
        }
    }
    delete(focus: number) {
        const id = this.currentIndex.contents[focus]
        this.currentIndex.contents.splice(focus, 1)
        // Update the focus if it's now out of bounds
        if (this.focus > this.currentIndex.contents.length - 1) {
            this.focus = this.focus - 1
        }

        // If this note was deleted from the outgoing links of
        // another note, then we should also remove that note
        // from the incoming links of this note.
        const indexID = this.currentIndexID;
        if (indexID.endsWith("-outgoing")) {
            const note : ID = indexID.substr(0, indexID.length - 9)
            const incomingIndex = this.db[id + "-incoming"] as Index
            const focus = incomingIndex.contents.findIndex(x => x === note)
            incomingIndex.contents.splice(focus, 1)
        }
        if (indexID.endsWith("-incoming")) {
            const note : ID = indexID.substr(0, indexID.length - 9)
            const outgoingIndex = this.db[id + "-outgoing"] as Index
            const focus = outgoingIndex.contents.findIndex(x => x === note)
            outgoingIndex.contents.splice(focus, 1)
        }
    }
    newNote(): ID {
        const id = uuid()
        this.db[id] = {type: 'note', contents: ""}
        this.db[id + "-incoming"] = {type: 'index', contents: []}
        this.db[id + "-outgoing"] = {type: 'index', contents: []}
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
            this.selection = undefined
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
        }
    }
    paste() {
        for (let i = 0; i < this.clipboard.length; i++) {
            this.insertAfter(this.focus + i, this.clipboard[i])
        }
    }

}