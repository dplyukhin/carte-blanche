import React from 'react';
import Hotkeys from 'react-hot-keys';
import logo from '../logo.jpeg';
import SearchBar from './SearchBar';
import CardPreview from './NotePreview';
import Note from './Note';
import Dropbox from '../cloud';
import { ID, Index, State } from '../model';
import { Action } from '../actions';
import { boundKeys, handleKey } from '../keymap';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';


function Loading(): JSX.Element {
    return (
        <div className="row">
            <div className="col s3 offset-s4">
                <div className="card-panel valign-wrapper">
                    <b className="center-align">Loading...</b>
                </div>
            </div>
        </div>
    )
}

function CloudAuthentication(): JSX.Element | null {
    return (
        Dropbox.isAuthenticated ? null :
            <div className="card-panel">
                <a href={Dropbox.authenticationURL}>Sign in to Dropbox</a>
            </div>
    )
}

function PreviewCards(state: State, index: Index): JSX.Element {
    return (
        <div>{
            index.contents.map(function (id: ID, i: number) {
                return <CardPreview key={i} card={state.db[id]} />
            })
        }</div>
    )
}

type MainProps = {
    state: State,
    dispatch(action: Action): any,
}

function MainCards({ state, dispatch }: MainProps): JSX.Element[] {
    return (
        state.currentIndex.contents.map(function (id: ID, i: number) {

            const card = state.db[id]
            if (card.type !== 'note')
                throw Error("I only know how to render notes")

            return <Note key={i} id={id} position={i}
                mode={state.mode} focus={state.focus} selection={state.selection}
                card={card} dispatch={dispatch}
            />;
        })
    )
}

type Props = {
    state: State | null,
    dispatch(action: Action): void
}

export default function App({ state, dispatch }: Props): JSX.Element {

    if (state === null) {
        return <Loading />
    }

    const focusedID = state.currentIndex.contents[state.focus]
    const outgoing = state.db[focusedID + "-outgoing"] as Index | undefined
    const incoming = state.db[focusedID + "-incoming"] as Index | undefined

    return (
        <Hotkeys
            keyName={boundKeys}
            onKeyDown={handleKey(dispatch)}
        >
            <DragDropContext onDragEnd={console.log}>
                <div className="row">
                    <div id="left-panel" className="pinned col l3 offset-l1 m3 hide-on-small-only">
                        <a href="/"><img id="logo" src={logo} alt="Go home" /></a>
                        {incoming && PreviewCards(state, incoming)}
                    </div>
                    <div id="main-panel" className="col l4 offset-l4 m6 offset-m3 s10 offset-s1">
                        <SearchBar dispatch={dispatch} />
                        <CloudAuthentication />
                        <Droppable droppableId="main">
                            {provided =>
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {MainCards({state, dispatch})}
                                    {provided.placeholder}
                                </div>
                            }
                        </Droppable>
                    </div>
                    <div id="right-panel" className="pinned col l3 offset-l8 m3 offset-m9 hide-on-small-only">
                        {outgoing && PreviewCards(state, outgoing)}
                    </div>
                </div>
            </DragDropContext>
        </Hotkeys>
    )
}