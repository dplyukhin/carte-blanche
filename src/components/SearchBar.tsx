import React, { useRef, useState } from "react";
import { Action } from "../actions";

export type Props = {
    dispatch(action: Action): void
}

export default function SearchBar({ dispatch } : Props): JSX.Element {
  const [query, setQuery] = useState("");
  const ref: React.MutableRefObject<HTMLInputElement | null> = useRef(null)

  function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    dispatch({ type: 'search', query })
    if (ref.current) ref.current.blur()
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      if (ref.current) ref.current.blur()
    }
  }

  return (
    <form className="input-field" onSubmit={onSubmit}>
      <i className="material-icons prefix">search</i>
      <input id="icon_prefix" type="text" ref={ref}
        onChange={ e => setQuery(e.target.value) } 
        onKeyDown={onKeyDown} />
      <label htmlFor="icon_prefix">Search</label>
    </form>
  )
}