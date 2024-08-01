import { SessionContext } from "@/components/auth-provider";
import supabase from "@/utils/supabase";
import { Swords, TableProperties, Users } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Club } from "../club/club.service";
import ClubCard from "./components/ClubCard";
import CreateDialog from "./components/CreateDialog";

export default function List() {
  const { session } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [clubs, setClubs] = useState<Club[]>([]);

  async function getClubs() {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("clubs")
        .select("*, members: club_enrolments (*)")
        .is("deleted_at", null)
        .order("created_at")
        .throwOnError();
      if (data) setClubs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getClubs();
  }, []);

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
  if (!clubs) {
    return <p className="text-center">Aucun club</p>;
  }
  return (
    <div className="px-4">
      <div className="mx-auto flex max-w-3xl flex-col justify-between gap-3 rounded-xl border bg-muted p-4 md:flex-row md:items-center md:rounded-full md:px-6">
        <p>
          <Users className="mr-2 inline-block h-5 w-5 align-text-bottom text-primary" />{" "}
          Trouvez ou créez un club.
        </p>
        <p>
          <Swords className="mr-2 inline-block h-5 w-5 align-text-bottom text-primary" />{" "}
          Inscrivez-vous à un match.
        </p>
        <p>
          <TableProperties className="mr-2 inline-block h-5 w-5 align-text-bottom text-primary" />{" "}
          Enregistrez vos scores !
        </p>
      </div>

      {session?.user ? (
        <>
          <h2 className="mt-8 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
            Mes clubs
          </h2>

          {session?.user && <CreateDialog />}

          <div className="mt-6 flex flex-wrap gap-6">
            {myClubs.length ? (
              myClubs.map((club) => (
                <ClubCard key={club.id} club={club} isMember />
              ))
            ) : (
              <p className="text-center">Vous n'êtes membre d'aucun club</p>
            )}
          </div>
        </>
      ) : (
        <div className="mt-4 text-center">
          <Link
            to="/auth"
            className="text-primary underline underline-offset-2"
          >
            C'est parti !
          </Link>
        </div>
      )}

      <h2 className="mb-4 mt-8 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
        Trouver un club
      </h2>

      <div className="mt-4 flex flex-wrap gap-6">
        {notMyClubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </div>
  );
}
