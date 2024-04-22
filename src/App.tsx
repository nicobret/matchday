import "./index.css";
import { createContext, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import supabaseClient from "./utils/supabase";

import Layout from "./layout/Layout.tsx";
import ClubList from "./scenes/clubs/List";
import ClubView from "./scenes/clubs/View";
import ClubEditor from "./scenes/clubs/Edit.tsx";
import GameView from "./scenes/games/View.tsx";
import GameEditor from "./scenes/games/Create.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <ClubList /> },

      { path: "club/:id", element: <ClubView /> },
      { path: "club/:id/edit", element: <ClubEditor /> },

      { path: "games", element: <div>Games</div> },
      { path: "games/:id", element: <GameView /> },
      { path: "games/create", element: <GameEditor /> },

      { path: "players", element: <div>Players</div> },
      { path: "players/:id", element: <div>Player</div> },
      {
        path: "*", // 404
        element: <div className="text-center my-24">404 - Not Found</div>,
      },
    ],
  },
]);

export const SessionContext = createContext(null);

export default function App() {
  const [session, setSession] = useState(null);
  console.log("🚀 ~ App ~ session:", session);

  useEffect(() => {
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
      <RouterProvider router={router} />
    </SessionContext.Provider>
  );
}
