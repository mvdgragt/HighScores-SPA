import React from "react";
import { Link } from "react-router-dom";

const SiteHeader = () => {
  return (
    <header>
      <nav className="border-bottom pb-3 mb-3 mt-3 ">
        <div className="mb-3 d-flex justify-content-between">
          <Link to={"/"}>
            <img src="/images/hs_logo.png" alt="highscores logo" />
          </Link>
          <Link to={"/admin"} className="btn btn-primary">
            Login
          </Link>
        </div>
        <form action="/search" className=" mb-3 ">
          <input
            className="form-control ds-input search rounded mt-3 "
            type="search"
            placeholder="Sök produkt"
            aria-label="Sök produkt"
            name="q"
          />
        </form>
      </nav>
    </header>
  );
};

export default SiteHeader;
