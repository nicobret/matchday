import "./index.css";
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import supabaseClient from "./utils/supabase";
import useStore from "./utils/zustand";

import ClubList from "./scenes/clubs/List.tsx";
import CreateClub from "./scenes/clubs/Create.tsx";
import Dashboard from "./scenes/dashboard/Dashboard.tsx";
import Layout from "./layout/Layout.tsx";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "games", element: <div>Games</div> },
      { path: "clubs", element: <ClubList /> },
      { path: "clubs/:id", element: <div>Club</div> },
      { path: "clubs/create", element: <CreateClub /> },
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
  const { setSession } = useStore();

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
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return <RouterProvider router={router} />;
}
