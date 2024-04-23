import "./index.css";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import supabaseClient from "@/utils/supabase";

import Layout from "./layout/Layout.tsx";
import ClubList from "./scenes/clubs/List";
import ClubView from "./scenes/clubs/View";
import ClubEditor from "./scenes/clubs/Edit.tsx";
import GameView from "./scenes/games/View.tsx";
import GameEditor from "./scenes/games/Create.tsx";

export const SessionContext = createContext(null);

export default function App() {
  const [session, setSession] = useState(null);

  async function getSession() {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    if (session) {
      setSession(session);
    }
  }

  useEffect(() => {
    getSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
      } else if (session) {
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<ClubList />} />
            <Route path="club/:id" element={<ClubView />} />
            <Route path="club/:id/edit" element={<ClubEditor />} />
            <Route path="games" element={<div>Games</div>} />
            <Route path="games/:id" element={<GameView />} />
            <Route path="games/create" element={<GameEditor />} />
            <Route path="players" element={<div>Players</div>} />
            <Route path="players/:id" element={<div>Player</div>} />
            <Route
              path="*"
              element={<div className="text-center my-24">404 - Not Found</div>}
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </SessionContext.Provider>
  );
}
