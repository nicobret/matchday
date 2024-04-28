import { useContext, useEffect, useState } from "react";
import { Club } from "../clubs.service";
import ClubCard from "./components/ClubCard";
import Container from "@/layout/Container";
import supabaseClient from "@/utils/supabase";
import CreateDialog from "./components/CreateDialog";
import { SessionContext } from "@/App";

export default function List() {
  const { session } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [clubs, setClubs] = useState<Club[]>([]);

  async function getClubs() {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from("clubs")
        .select("*, members: club_enrolments (*)")
        .order("created_at");
      if (error) {
        throw new Error(error.message);
      }
      setClubs(data);
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
    c.members.some((m) => m.user_id === session?.user?.id)
  );

  const notMyClubs = clubs.filter(
    (c) => !c.members.some((m) => m.user_id === session?.user?.id)
  );

  if (loading) {
    return <p className="text-center animate-pulse">Chargement...</p>;
  }

  if (!clubs) {
    return <p className="text-center">Aucun club</p>;
  }

  return (
    <div className="p-4">
      {session?.user && (
        <>
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-6 first:mt-0">
            Mes clubs
          </h2>

          {session?.user && <CreateDialog />}

          <div className="flex flex-wrap gap-6 mt-6">
            {myClubs.length ? (
              myClubs.map((club) => <ClubCard key={club.id} club={club} />)
            ) : (
              <p className="text-center">Vous n'êtes membre d'aucun club</p>
            )}
          </div>
        </>
      )}

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-6 first:mt-0">
        Trouver un club
      </h2>

      <div className="flex flex-wrap gap-6 mt-4">
        {notMyClubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </div>
  );
}
