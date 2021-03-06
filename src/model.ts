import { v4 as uuid } from 'uuid';
import * as Search from './search';

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

export type Mode = 'viewing' | 'editing' | 'selecting'


export const DB_STRING = 'database';

export type Snapshot = {
    db: Database,
    root: ID,
    timestamp: number
}

export class State {
    // Persistent state
    db: Database
    root: ID

    // Temporary state
    currentIndexID: ID
    focus: number
    mode: Mode
    clipboard: ID[]
    selection?: number
    dirty: boolean
    index: Search.Index

    constructor(snapshot: Snapshot | null) {
        if (snapshot === null) {
            this.root = uuid()
            this.db = {}
            this.db[this.root] = { type: 'index', contents: [] }
        }
        else {
            this.root = snapshot.root
            this.db = snapshot.db
        }
        if (window.location.hash !== "") {
            this.currentIndexID = window.location.hash.slice(1)
            this.focus = window.history.state.focus || -1
        }
        else {
            this.currentIndexID = this.root 
            this.focus = -1
        }
        this.mode = 'viewing'
        this.clipboard = []
        this.dirty = false;

        // Build index
        this.index = Search.newIndex();
        for (const [id, note] of this.notes()) {
            Search.addToIndex(id, note.contents, this.index);
        }
    }

    get snapshot(): Snapshot {
        return {
            db: this.db,
            root: this.root,
            timestamp: Date.now()
        }
    }

    save() {
        localStorage.setItem(DB_STRING, JSON.stringify(this.snapshot))
        console.log("Saved change to local storage")
        this.dirty = true
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
    * notes(): Generator<[ID, Note]> {
        for (const id in this.db) {
            if (Object.prototype.hasOwnProperty.call(this.db, id)) {
                const card = this.db[id];
                if (card.type === 'note') {
                    yield [id, card];
                }
            }
        }
    }

    // NAVIGATION

    view(id: ID, focus: number) {
        this.currentIndexID = id;
        this.focus = focus === undefined ? -1 : focus
    }
    enter(id: ID) {
        const focus = this.db[id].contents.length > 0 ? 0 : -1;
        window.history.replaceState({ focus: this.focus }, "", "#" + this.currentIndexID);
        window.history.pushState({focus: focus}, "", "#" + id);
        this.view(id, focus)
    }
    goBack() {
        window.history.back()
    }
    goForward() {
        window.history.forward()
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

    search(query: string) {
        const results = Search.search(query, this.index)
        const id = this.newIndex()
        const index = this.db[id]!
        index.contents = results
        this.enter(id)
        this.save()
    }
    showRelatedNotes() {
        const card = this.focusedCard
        if (card !== undefined && card.type === 'note') {
            const text = Search.removeFormatting(card.contents)
            this.search(text)
        }
    }
    updateNote(id : ID, contents : string): boolean {
        const note = this.db[id]
        if (note && note.type === 'note') {
            this.db[id] = {...note, contents}
            return true
        }
        else {
            return false
        }
    }
    /** Helper method for updating indexes immutably.
     * Passes a deep copy of the index with ID `id` to the `update` function
     * then stores the new object back in the database.
     */
    updateIndex(id: ID, update: (index: Index) => void) {
        const note: Index = this.db[id] as Index
        const copy: Index = { type: 'index', contents: note.contents.slice() }
        update(copy)
        this.db[id] = copy
    }
    insertAfter(focus: number, id: ID) {
        this.currentIndex.contents.splice(focus + 1, 0, id)

        // If this note is added to the outgoing links of another
        // note, then add the latter to the *incoming* links of the former.
        const indexID = this.currentIndexID;
        if (indexID.endsWith("-outgoing")) {
            const note : ID = indexID.substr(0, indexID.length - 9)

            this.updateIndex(id + "-incoming", (index) => {
                index.contents.push(note)
            })
        }
        if (indexID.endsWith("-incoming")) {
            const note : ID = indexID.substr(0, indexID.length - 9)

            this.updateIndex(id + "-outgoing", (index) => {
                index.contents.push(note)
            })
        }
        this.save()
    }
    remove(focus: number) {
        const id = this.currentIndex.contents[focus]

        // Remove the focused element from the index
        this.updateIndex(this.currentIndexID, (index) => {
            index.contents.splice(focus, 1)
        })

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

            this.updateIndex(id + "-incoming", (index) => {
                const focus = index.contents.findIndex(x => x === note)
                index.contents.splice(focus, 1)
            })
        }
        if (indexID.endsWith("-incoming")) {
            const note : ID = indexID.substr(0, indexID.length - 9)

            this.updateIndex(id + "-outgoing", (index) => {
                const focus = index.contents.findIndex(x => x === note)
                index.contents.splice(focus, 1)
            })
        }
        this.save()
    }
    newNote(): ID {
        const id = uuid()
        this.db[id] = {type: 'note', contents: ""}
        this.db[id + "-incoming"] = {type: 'index', contents: []}
        this.db[id + "-outgoing"] = {type: 'index', contents: []}
        this.save()
        return id
    }
    newIndex(): ID {
        const id = uuid()
        this.db[id] = {type: 'index', contents: []}
        this.save()
        return id
    }
    removeSelection() {
        if (this.mode === 'viewing') {
            this.remove(this.focus)
        }
        else if (this.mode === 'selecting') {
            const lower = Math.min(this.focus, this.selection!)
            const upper = Math.max(this.focus, this.selection!)
            for (let i = lower; i <= upper; i++) {
                // Delete the lowest index, and the next note
                // to delete will be moved to that element. 
                this.remove(lower);
            }
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