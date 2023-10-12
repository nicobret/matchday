import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import CreateLeague from "./scenes/leagues/Create.tsx";
import ListLeagues from "./scenes/leagues/List.tsx";
import Dashboard from "./scenes/dashboard/Dashboard.tsx";
import supabaseClient from "./utils/supabase.ts";

export async function leaguesLoader() {
  const { data: leagues, error: leagueError } = await supabaseClient
    .from("leagues")
    .select();
  if (leagueError) {
    console.error(leagueError);
    return null;
  }

  const { data: userData } = await supabaseClient.auth.getUser();
  if (!userData.user?.id) return { leagues };

  const { data: memberships, error: membershipError } = await supabaseClient
    .from("league_memberships")
    .select()
    .eq("user_id", userData.user.id);
  if (membershipError) {
    console.error(membershipError);
    return null;
  }
  return { leagues, memberships };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "/leagues",
        element: <ListLeagues />,
        loader: leaguesLoader,
      },
      {
        path: "/leagues/create",
        element: <CreateLeague />,
      },
      {
        path: "/leagues/:id",
        element: <div>League</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
