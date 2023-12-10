import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useClubs } from "./useClubs";
import { ChevronRight } from "lucide-react";

export default function View() {
  const { id } = useParams();
  const { club, fetchClub } = useClubs();

  useEffect(() => {
    if (!id) {
      console.error("No id provided");
      return;
    }
    if (id === club?.id.toString()) {
      console.log("Club already fetched");
      return;
    }
    async function getClub(id: string) {
      console.log("Fetching club data");
      await fetchClub(id);
    }
    getClub(id);
  }, [id]);

  if (!club) return <p className="text-center animate_pulse">Chargement...</p>;

  return (
    <div className="border rounded p-6 space-y-6">
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Link to="/clubs">
          <p>Clubs</p>
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="#">
          <p>{club.name}</p>
        </Link>
      </div>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {club.name}
      </h2>
      <div className="flex flex-wrap gap-6">
        {club.club_enrolments.map((m) => (
          <p key={m.user_id}>{m.user_id}</p>
        ))}
      </div>
    </div>
  );
}
