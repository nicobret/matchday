import "./index.css";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import supabaseClient from "./utils/supabase";
import useStore from "./utils/zustand";
import Header from "./layout/Header";

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

  return (
    <div className="max-w-screen-2xl mx-auto">
      <Header />
      <Outlet />
    </div>
  );
}
