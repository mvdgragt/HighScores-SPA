import { Outlet } from "react-router-dom";

import "./App.css";
import SiteHeader from "./components/SiteHeader/SiteHeader";

function App() {
  return (
    <div className="container-fluid">
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <footer className="mt-auto py-3 my-4">
        <p className="text-center text-muted border-top pb-3 mb-3">
          © Copyright Highscore
        </p>
      </footer>
    </div>
  );
}

export default App;
