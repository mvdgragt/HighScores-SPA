import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home/Home";
import GameDetails from "./routes/GameDetails/GameDetails";
import SearchResults from "./routes/SearchResults/SearchResults";
import New from "./routes/Admin/Score/New";
import { default as GameHome } from "./routes/Admin/Games/Index"
import { default as NewGame } from "./routes/Admin/Games/New"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="games/:urlSlug" element={<GameDetails />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="admin/score/new" element={<New />} />
            <Route path="admin/games/" element={<GameHome />} />      
            <Route path="admin/games/new" element={<NewGame />} />
        </Route>
      </Routes>
    </Router>
);

