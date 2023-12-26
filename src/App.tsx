import "./index.css";
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import supabaseClient from "./utils/supabase";
import useStore from "./utils/zustand";

import Layout from "./layout/Layout.tsx";
import Dashboard from "./scenes/dashboard/Dashboard.tsx";
import ClubList from "./scenes/clubs/List.tsx";
import CreateClub from "./scenes/clubs/Create.tsx";
import CreateGame from "./scenes/games/Create.tsx";
import ViewGame from "./scenes/games/View.tsx";
import ViewClub from "./scenes/clubs/View.tsx";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },

      { path: "clubs", element: <ClubList /> },
      { path: "clubs/:id", element: <ViewClub /> },
      { path: "clubs/create", element: <CreateClub /> },

      { path: "games", element: <div>Games</div> },
      { path: "games/:id", element: <ViewGame /> },
      { path: "games/create", element: <CreateGame /> },

      { path: "players", element: <div>Players</div> },
      { path: "players/:id", element: <div>Player</div> },
    ],
  },
  {
    path: "auth",
    element: (
      <Auth
        supabaseClient={supabaseClient}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
      />
    ),
  },
]);

export default function App() {
  const { session: sessionFromStorage, setSession } = useStore();

  async function getSession() {
    const res = await supabaseClient.auth.getSession();
    if (res.error) console.error(res.error);
    if (!res.data.session) return;
    setSession(res.data.session);
  }

  useEffect(() => {
    getSession();
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      const userIdFromSubscription = session?.user?.id;
      const userIdFromStorage = sessionFromStorage?.user?.id;
      const shouldUpdate = userIdFromSubscription !== userIdFromStorage;
      if (shouldUpdate) setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return <RouterProvider router={router} />;
}
