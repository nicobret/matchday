import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useClubs } from "./useClubs";
import { ChevronRight, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import useStore from "@/utils/zustand";

export default function View() {
  const { session } = useStore();
  const { id } = useParams();
  const { club, fetchClub, joinClub, leaveClub } = useClubs();

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

      {session &&
        (club.club_enrolments
          .map((m) => m.user_id)
          .includes(session.user.id) ? (
          <Button
            onClick={() => leaveClub(club.id)}
            variant="secondary"
            className="flex"
          >
            Quitter
          </Button>
        ) : (
          <Button onClick={() => joinClub(club.id)} className="gap-1">
            <PlusIcon className="h-5 w-5" />
            Rejoindre
          </Button>
        ))}

      <p>
        {club.club_enrolments.length} membre
        {club.club_enrolments.length > 1 && "s"}
      </p>

      <p>{club.description}</p>
    </div>
  );
}
