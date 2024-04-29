import "./index.css";
import { Suspense, createContext, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import supabaseClient from "@/utils/supabase";
import Layout from "./layout/Layout.tsx";

const Account = lazy(() => import("./scenes/account"));
const Club = lazy(() => import("./scenes/club"));
const Game = lazy(() => import("./scenes/game"));
const Home = lazy(() => import("./scenes/home"));
const Player = lazy(() => import("./scenes/player"));

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
              <Route path="/" element={<Home />} />
              <Route path="account" element={<Account />} />
              <Route path="club/:id" element={<Club />} />
              <Route path="game/:id" element={<Game />} />
              <Route path="player/:id" element={<Player />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </SessionContext.Provider>
  );
}

function NotFound() {
  return <div>404 - Not Found</div>;
}
