import supabase from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SessionContext = createContext<{
  session: Session | null;
  setSession: (session: Session | null) => void;
}>({
  session: null,
  setSession: () => {},
});

async function fetchSession() {
  const { error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message);
  }
}

function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
        navigate("/");
      } else if (event === "SIGNED_IN") {
        setSession(session);
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get("redirectTo");
        if (redirectTo) navigate(redirectTo);
      } else if (session) {
        setSession(session);
      }
    });

    fetchSession().catch(console.error);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export { SessionContext, SessionProvider };
