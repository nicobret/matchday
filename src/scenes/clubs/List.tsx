import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../../utils/zustand";
import { useClubs } from "./useClubs";
import ClubCard from "./components/ClubCard";
import { ChevronRight, Plus } from "lucide-react";
import { clubSummary } from "./clubs.service";
import Container from "@/layout/Container";

export default function List() {
  const [loading, setLoading] = useState(false);
  const [clubs, setClubs] = useState<clubSummary[] | null>(null);
  const { fetchClubs } = useClubs();

  async function getClubs() {
    setLoading(true);
    const clubs = await fetchClubs();
    if (!clubs) {
      setLoading(false);
      return;
    }
    setClubs(clubs as unknown as clubSummary[]);
    setLoading(false);
  }

  useEffect(() => {
    getClubs();
  }, []);

  const { session } = useStore();

  if (loading)
    return <p className="text-center animate-pulse">Chargement...</p>;

  if (!clubs) return <p className="text-center">Aucun club</p>;

  return (
    <Container>
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Link to="/clubs">
          <p>Clubs</p>
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="#">
          <p>Liste des clubs</p>
        </Link>
      </div>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-6">
        Trouver un club
      </h2>

      {session && (
        <Link to="create">
          <div className="flex items-center underline underline-offset-2 hover:text-gray-500 mt-6 gap-2">
            <Plus className="w-5 h-5" />
            <p>Créer un club</p>
          </div>
        </Link>
      )}

      <div className="flex flex-wrap gap-6">
        {clubs.map((c) => (
          <ClubCard key={c.id} {...c} />
        ))}
      </div>
    </Container>
  );
}
