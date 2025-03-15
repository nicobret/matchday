import { SessionContext } from "@/components/auth-provider";
import supabase from "@/utils/supabase";
import { useContext } from "react";
import { useLocation } from "wouter";

export default function useAuth() {
  const { session, setSession } = useContext(SessionContext);
  const [, navigate] = useLocation();

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    navigate("/");
  }

  return { session, logout };
}
