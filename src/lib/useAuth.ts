import { SessionContext } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import supabase from "@/utils/supabase";
import { useMutation } from "@tanstack/react-query";
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

  const { mutate: login } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: (data) => {
      // setSession(data.session);
      toast({ title: "Succès", description: "Vous êtes connecté." });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    session,
    login,
    logout,
    isLoggedIn: !!session,
    isLoggedOut: !session,
  };
}
