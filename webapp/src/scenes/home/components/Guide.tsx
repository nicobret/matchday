import useAuth from "@/lib/auth/useAuth";
import useProfile from "@/lib/profile/useProfile";
import { useToggle } from "@uidotdev/usehooks";
import { ChevronDown, Swords, TableProperties, Users } from "lucide-react";
import { Link } from "wouter";

export default function Guide() {
  const { session, isAuthenticated, isLoggedOut } = useAuth();
  const { data: profile, isLoading: loadingProfile } = useProfile(
    session?.user?.id,
  );
  const [isOpen, toggleOpen] = useToggle(false);

  if (loadingProfile) {
    return (
      <p className="animate-pulse text-center">Chargement des données...</p>
    );
  }

  const isProfileIncomplete: boolean = isAuthenticated && !profile?.firstname;

  return (
    <section id="guide" className="rounded-lg border p-4">
      <div className="flex justify-between">
        <h2 className="text-muted-foreground scroll-m-20 text-xl font-semibold tracking-tight">
          Comment ça marche ?
        </h2>
        <button onClick={() => toggleOpen(!isOpen)}>
          <ChevronDown className={`${isOpen && "rotate-180"} transition`} />
        </button>
      </div>
      {isOpen && (
        <>
          <p className="mt-4">
            <Users className="text-primary mr-4 inline-block h-5 w-5 align-text-bottom" />
            Trouve un club ou créé le tien.
          </p>
          <p className="mt-2">
            <Swords className="text-primary mr-4 inline-block h-5 w-5 align-text-bottom" />
            Inscris-toi à un match.
          </p>
          <p className="mt-2">
            <TableProperties className="text-primary mr-4 inline-block h-5 w-5 align-text-bottom" />
            Enregistre tes scores et tes perfs !
          </p>

          {isProfileIncomplete && (
            <div className="mt-4 text-center">
              <Link
                to="~/account"
                className="text-primary underline underline-offset-2"
              >
                Compléter mon profil
              </Link>
            </div>
          )}

          {isLoggedOut && (
            <div className="mt-4 text-center">
              <Link
                to={`~/auth/login?redirectTo=${window.location.pathname}`}
                className="text-primary underline underline-offset-2"
              >
                C'est parti !
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
