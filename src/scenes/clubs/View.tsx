import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useClubs } from "./useClubs";
import { Check, ClipboardSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import useStore from "@/utils/zustand";
import ClubHistory from "./components/ClubHistory";
import ClubMembers from "./components/ClubMembers";
import ClubInfo from "./components/ClubInfo";
import UpcomingGames from "./components/UpcomingGames";
import { userIsInClub } from "./clubs.service";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function View() {
  const { session } = useStore();
  const { id } = useParams();
  const { club, fetchClub, joinClub, leaveClub } = useClubs();

  useEffect(() => {
    if (!id) {
      console.error("No id provided");
      return;
    }
    async function getClub(id: string) {
      await fetchClub(id);
    }
    getClub(id);
  }, [id]);

  if (!club) return <p className="text-center animate_pulse">Chargement...</p>;

  return (
    <div className="p-4">
      <Breadcrumbs
        links={[
          { label: "Clubs", link: "/clubs" },
          { label: club.name, link: "#" },
        ]}
      />

      <div className="flex gap-4 items-end scroll-m-20 border-b pb-3 mt-6 mb-2">
        <h2 className="text-3xl font-semibold tracking-tight">{club.name}</h2>

        {session &&
          (userIsInClub(session.user, club) ? (
            <Button
              onClick={() => leaveClub(club.id)}
              variant="secondary"
              className="flex gap-2 ml-auto"
            >
              <Check className="h-5 w-5" />
              <span className="hidden md:block">Rejoint</span>
            </Button>
          ) : (
            <Button
              onClick={() => joinClub(club.id)}
              className="flex gap-2 ml-auto"
            >
              <ClipboardSignature className="h-5 w-5" />
              Rejoindre
            </Button>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
        <ClubInfo club={club} />
        <UpcomingGames club={club} />
        <ClubMembers club={club} />
        <ClubHistory clubId={club.id} />
      </div>
    </div>
  );
}
