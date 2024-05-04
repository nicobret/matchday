import supabase from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";

export const SessionContext = createContext<{
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

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
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
