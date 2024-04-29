import "./index.css";
import { Suspense, createContext, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import supabaseClient from "@/utils/supabase";
import Layout from "./layout/Layout.tsx";

const Account = lazy(() => import("./scenes/account/index.tsx"));
const ClubList = lazy(() => import("./scenes/clubs/List"));
const ClubView = lazy(() => import("./scenes/clubs/View"));
const ClubEditor = lazy(() => import("./scenes/clubs/Edit.tsx"));
const GameView = lazy(() => import("./scenes/games/View.tsx"));
const GameEditor = lazy(() => import("./scenes/games/Create.tsx"));

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
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<ClubList />} />
              <Route path="account" element={<Account />} />
              <Route path="club/:id" element={<ClubView />} />
              <Route path="club/:id/edit" element={<ClubEditor />} />
              <Route path="games" element={<div>Games</div>} />
              <Route path="games/:id" element={<GameView />} />
              <Route path="games/create" element={<GameEditor />} />
              <Route path="players" element={<div>Players</div>} />
              <Route path="players/:id" element={<div>Player</div>} />
              <Route
                path="*"
                element={
                  <div className="text-center my-24">404 - Not Found</div>
                }
              />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </SessionContext.Provider>
  );
}
