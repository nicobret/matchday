import "./index.css";
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import supabaseClient from "./utils/supabase";
import useStore from "./utils/zustand";

import Layout from "./layout/Layout.tsx";
import ClubList from "./scenes/clubs/List/index.tsx";
import CreateGame from "./scenes/games/Create.tsx";
import ViewGame from "./scenes/games/View.tsx";
import ViewClub from "./scenes/clubs/View/index.tsx";
import EditClub from "./scenes/clubs/Edit.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <ClubList /> },

      { path: "club/:id", element: <ViewClub /> },
      { path: "club/:id/edit", element: <EditClub /> },

      { path: "games", element: <div>Games</div> },
      { path: "games/:id", element: <ViewGame /> },
      { path: "games/create", element: <CreateGame /> },

      { path: "players", element: <div>Players</div> },
      { path: "players/:id", element: <div>Player</div> },
      {
        path: "*", // 404
        element: <div className="text-center my-24">404 - Not Found</div>,
      },
    ],
  },
]);

export default function App() {
  const { setUser } = useStore();

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabaseClient.auth.getUser();
      if (error) {
        console.error(error);
        return;
      }
      if (data) {
        setUser(data.user);
      }
    }
    getUser();
  }, [setUser]);

  return <RouterProvider router={router} />;
}
