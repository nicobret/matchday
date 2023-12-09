import { useEffect } from "react";
import { Link } from "react-router-dom";
import useStore from "../../utils/zustand";
import ClubCard from "./components/ClubCard";
import { useClubs } from "./useClubs";

export default function List() {
  const { clubs, fetchClubs } = useClubs();

  useEffect(() => {
    async function getClubs() {
      await fetchClubs();
    }
    getClubs();
  }, []);

  const { session } = useStore();

  if (!session || !clubs)
    return <p className="text-center animate-pulse">Chargement...</p>;

  return (
    <div className="border my-6 rounded p-6 space-y-6">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Mes clubs
      </h2>
      <div className="flex flex-wrap gap-6">
        {clubs
          .filter((l) =>
            l.club_enrolments.some((m) => m.user_id === session.user.id)
          )
          .map((league) => (
            <ClubCard key={league.id} {...league} />
          ))}
      </div>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Rejoindre un club
      </h2>
      <div className="flex flex-wrap gap-6">
        {clubs.map((league) => (
          <ClubCard key={league.id} {...league} />
        ))}
      </div>

      {session && (
        <Link to="create">
          <p className="underline underline-offset-2 hover:text-gray-500 my-6">
            Créer un club
          </p>
        </Link>
      )}
    </div>
  );
}
