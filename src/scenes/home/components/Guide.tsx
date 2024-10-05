import { SessionContext } from "@/components/auth-provider";
import { ChevronUp, Swords, TableProperties, Users } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Tables } from "types/supabase";

export default function Guide({ profile }: { profile?: Tables<"users"> }) {
  const { session } = useContext(SessionContext);

  const [open, setOpen] = useState(
    !(localStorage.getItem("close-guide") === "true") ||
      (session?.user && !profile?.firstname),
  );

  function handleClick() {
    if (open) {
      localStorage.setItem("close-guide", "true");
      setOpen(false);
    } else {
      localStorage.removeItem("close-guide");
      setOpen(true);
    }
  }

  return (
    <section id="guide" className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h2 className="scroll-m-20 font-semibold tracking-tight text-muted-foreground">
          Comment ça marche ?
        </h2>

        <button onClick={handleClick}>
          <ChevronUp
            className={`h-5 w-5 transition-all ${open ? "" : "rotate-180"}`}
          />
        </button>
      </div>

      {open ? (
        <>
          <p className="mt-4">
            <Users className="mr-4 inline-block h-5 w-5 align-text-bottom text-primary" />
            Trouve un club ou créé le tien.
          </p>

          <p className="mt-2">
            <Swords className="mr-4 inline-block h-5 w-5 align-text-bottom text-primary" />
            Inscris-toi à un match.
          </p>
          <p className="mt-2">
            <TableProperties className="mr-4 inline-block h-5 w-5 align-text-bottom text-primary" />
            Enregistre tes scores et tes perfs !
          </p>

          {session?.user && !profile?.firstname && (
            <div className="mt-4 text-center">
              <Link
                to="/account"
                className="text-primary underline underline-offset-2"
              >
                Compléter mon profil
              </Link>
            </div>
          )}

          {session?.user ? null : (
            <div className="mt-4 text-center">
              <Link
                to={`/auth?redirectTo=${window.location.pathname}`}
                className="text-primary underline underline-offset-2"
              >
                C'est parti !
              </Link>
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}
