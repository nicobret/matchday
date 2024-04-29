import supabase from "@/utils/supabase";
import { createContext, useEffect, useState } from "react";

export const SessionContext = createContext(null);

export default function SessionProvider({ children }) {
  const [session, setSession] = useState(null);

  async function getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      setSession(session);
    }
  }

  useEffect(() => {
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
      } else if (session) {
        setSession(session);
      }
    });

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
