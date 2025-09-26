import { SessionContext } from "@/components/auth-provider";
import supabase from "@/utils/supabase";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function useAuth() {
  const { session, setSession } = useContext(SessionContext);
  const [, navigate] = useLocation();

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
      toast.success("Vous êtes connecté.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    session,
    login,
    logout,
    isAuthenticated: !!session,
    isLoggedOut: !session,
  };
}
