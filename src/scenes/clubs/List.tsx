import { useEffect } from "react";
import { Link } from "react-router-dom";
import useStore from "../../utils/zustand";
import { useClubs } from "./useClubs";
import ClubCard from "./components/ClubCard";
import { ChevronRight, Plus } from "lucide-react";

export default function List() {
  const { clubs } = useStore();
  const { loading, fetchClubs } = useClubs();

  useEffect(() => {
    if (clubs) return;
    async function getClubs() {
      await fetchClubs();
    }
    getClubs();
  }, []);

  const { session } = useStore();

  if (loading)
    return <p className="text-center animate-pulse">Chargement...</p>;

  if (!clubs) return <p className="text-center">Aucun club</p>;

  return (
    <div className="border rounded p-6 space-y-6">
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Link to="/clubs">
          <p>Clubs</p>
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="#">
          <p>Liste des clubs</p>
        </Link>
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
          <div className="flex items-center underline underline-offset-2 hover:text-gray-500 mt-6 gap-2">
            <Plus className="w-5 h-5" />
            <p>Créer un club</p>
          </div>
        </Link>
      )}
    </div>
  );
}
