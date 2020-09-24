import { ID } from "./model";

export type Action 
    = { type: 'search', query: string }
    | { type: 'find related notes' }

    | { type: 'edit' }
    | { type: 'update note', id: ID, contents: string }
    | { type: 'stop editing' }
    | { type: 'new note' }
    | { type: 'remove' }

    | { type: 'left' }
    | { type: 'right' }
    | { type: 'up' }
    | { type: 'down' }
    | { type: 'back' }
    | { type: 'forward' }

    | { type: 'copy' }
    | { type: 'paste' }
    | { type: 'cut' }
    | { type: 'undo' }
    | { type: 'redo' }

    | { type: 'select and go down' }
    | { type: 'select and go up' }