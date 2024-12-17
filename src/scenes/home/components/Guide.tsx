import { SessionContext } from "@/components/auth-provider";
import { Swords, TableProperties, Users } from "lucide-react";
import { useContext } from "react";
import { Tables } from "types/supabase";
import { Link } from "wouter";

export default function Guide({ profile }: { profile?: Tables<"users"> }) {
  const { session } = useContext(SessionContext);

  return (
    <section id="guide" className="rounded-lg border p-4">
      <h2 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground">
        Comment ça marche ?
      </h2>
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
            to="~/account"
            className="text-primary underline underline-offset-2"
          >
            Compléter mon profil
          </Link>
        </div>
      )}

      {session?.user ? null : (
        <div className="mt-4 text-center">
          <Link
            to={`~/auth?redirectTo=${window.location.pathname}`}
            className="text-primary underline underline-offset-2"
          >
            C'est parti !
          </Link>
        </div>
      )}
    </section>
  );
}
