import { SessionContext } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import supabase from "@/utils/supabase";
import { useContext } from "react";
import { useLocation } from "wouter";

export default function useAuth() {
  const { session, setSession } = useContext(SessionContext);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    navigate("/");
  }

  async function login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Succès", description: "Vous êtes connecté." });
    return { data, error };
  }

  return { session, login, logout };
}
