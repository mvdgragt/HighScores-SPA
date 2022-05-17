import React from 'react'
import { Link } from "react-router-dom";

const SiteHeader = () => {
  return (
    <header>
        <nav className="mt-auto border-bottom pb-3 mb-3">
          <Link to={"/"}> 
          <img src="/images/hs_logo.png" alt="highscores logo" /> 
          </Link>
          <form action="/search" className=" mt-auto pb-3 mb-3">
            <input
              className="form-control ds-input search rounded"
              type="search"
              placeholder="Sök produkt"
              aria-label="Sök produkt"
              name="q"
            />
          </form>
        </nav>
      </header>
  )
}

export default SiteHeader