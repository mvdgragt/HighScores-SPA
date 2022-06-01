import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home/Home";
import GameDetails from "./routes/GameDetails/GameDetails";
import SearchResults from "./routes/SearchResults/SearchResults";
import Login from "./routes/Admin/Login/Login";
import Register from "./routes/Admin/Register/Register";
import Admin from "./routes/Admin/Admin";
import Dashboard from "./routes/Admin/Dashboard/Dashboard";
import New from "./routes/Admin/Score/New";
import { default as GameHome } from "./routes/Admin/Games/Index";
import { default as NewGame } from "./routes/Admin/Games/New";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/admin/*" element={<Admin />}>
          <Route index element={<Login />} />
          <Route path="score/new" element={<New />} />
          <Route path="games/" element={<GameHome />} />
          <Route path="games/new" element={<NewGame />} />       
          <Route path="login" element={<Login />} />   
          <Route path="register" element={<Register />} />   
        </Route>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="games/:urlSlug" element={<GameDetails />} />
          <Route path="search" element={<SearchResults />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);
