import { SessionContext } from "@/components/auth-provider";
import supabase from "@/utils/supabase";
import {
  ChevronDown,
  LifeBuoy,
  Search,
  Shield,
  Swords,
  TableProperties,
  Users,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tables } from "types/supabase";
import { fetchProfile } from "../account/account.service";
import { Club } from "../club/club.service";
import ClubCard from "./components/ClubCard";
import CreateDialog from "./components/CreateDialog";

export default function Home() {
  const { session } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Tables<"users">>();
  const [clubs, setClubs] = useState<Club[]>([]);

  async function getClubs() {
    try {
      const { data } = await supabase
        .from("clubs")
        .select("*, members: club_enrolments (*)")
        .is("deleted_at", null)
        .order("created_at")
        .throwOnError();
      if (data) setClubs(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getProfile() {
    try {
      const data = await fetchProfile();
      if (data) setProfile(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    if (!clubs.length) getClubs();
    if (session) getProfile();
    setLoading(false);
  }, [session]);

  const myClubs = clubs.filter((c) =>
    c.members?.some((m) => m.user_id === session?.user?.id),
  );

  const notMyClubs = clubs.filter(
    (c) => !c.members?.some((m) => m.user_id === session?.user?.id),
  );

  if (loading) {
    return (
      <p className="animate-pulse text-center">Chargement des données...</p>
    );
  }

  if (profile && !profile?.firstname) {
    navigate("/account");
  }

  return (
    <div className="px-4 md:mt-24">
      <section id="guide" className="">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
          Comment ça marche ?
        </h2>

        <p className="mt-4">
          <Users className="mr-2 inline-block h-5 w-5 align-text-bottom text-primary" />
          Trouvez ou créez un club.
        </p>

        <p className="mt-2">
          <Swords className="mr-2 inline-block h-5 w-5 align-text-bottom text-primary" />
          Inscrivez-vous à un match.
        </p>
        <p className="mt-2">
          <TableProperties className="mr-2 inline-block h-5 w-5 align-text-bottom text-primary" />
          Enregistrez vos scores !
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

        {!session?.user ? (
          <div className="mt-4 text-center">
            <Link
              to={`/auth?redirectTo=${window.location.pathname}`}
              className="text-primary underline underline-offset-2"
            >
              C'est parti !
            </Link>
          </div>
        ) : null}

        <p className="mt-6 text-center">
          <LifeBuoy className="inline-block h-5 w-5 align-text-bottom text-secondary" />
        </p>
      </section>

      {session?.user ? (
        <section id="my-clubs" className="mt-4">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
            Mes clubs
          </h2>

          {session?.user && (
            <div className="mt-4 flex items-center gap-5">
              <CreateDialog />
              <Link to="#browse-clubs" className="text-primary">
                Trouver un club
                <ChevronDown className="ml-1 inline-block" />
              </Link>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-6">
            {myClubs.length ? (
              myClubs.map((club) => (
                <ClubCard key={club.id} club={club} isMember />
              ))
            ) : (
              <p className="text-center">Vous n'êtes membre d'aucun club</p>
            )}
          </div>

          <p className="mt-6 text-center">
            <Shield className="inline-block h-5 w-5 align-text-bottom text-secondary" />
          </p>
        </section>
      ) : null}

      <section id="browse-clubs" className="mt-4">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
          Trouver un club
        </h2>

        <div className="mt-4 flex flex-wrap gap-6">
          {notMyClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>

        <p className="mt-6 text-center">
          <Search className="inline-block h-5 w-5 align-text-bottom text-secondary" />
        </p>
      </section>
    </div>
  );
}
