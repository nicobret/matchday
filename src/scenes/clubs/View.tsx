import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { clubType, useClubs } from "./useClubs";
import { ChevronRight, DoorOpen, Plus, PlusIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import useStore from "@/utils/zustand";

function userIsInClub(club: clubType, session: any) {
  return club.members.map((m) => m.id).includes(session.user.id);
}

function userIsAdmin(club: clubType, session: any) {
  return club.members
    .filter((m) => m.role === "admin")
    .map((m) => m.id)
    .includes(session.user.id);
}

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
    <div className="md:border rounded p-6 space-y-6">
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Link to="/clubs">
          <p>Clubs</p>
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="#">
          <p>{club.name}</p>
        </Link>
      </div>

      <div className="flex gap-4 items-end scroll-m-20 border-b pb-2 first:mt-0">
        <h2 className="text-3xl font-semibold tracking-tight">{club.name}</h2>

        <div className="flex gap-2 items-center">
          {club.members.length}
          <Users className="h-4 w-4" />
        </div>

        {session &&
          (userIsInClub(club, session) ? (
            <Button
              onClick={() => leaveClub(club.id)}
              variant="secondary"
              className="flex gap-2 ml-auto"
            >
              <DoorOpen className="h-5 w-5" />
              <span className="hidden md:block">Quitter le club</span>
            </Button>
          ) : (
            <Button onClick={() => joinClub(club.id)} className="ml-auto">
              <PlusIcon className="h-5 w-5" />
              Rejoindre
            </Button>
          ))}
      </div>

      <p>
        Créé par{" "}
        <Link to={`users/${club.creator.id}`}>
          <span className="text-gray-500 underline underline-offset-4 hover:text-gray-800">
            {club.creator.firstname} {club.creator.lastname}
          </span>
        </Link>{" "}
        le{" "}
        {new Date(club.created_at).toLocaleDateString("fr-FR", {
          dateStyle: "long",
        })}
      </p>

      <h3 className="text-xl font-semibold">Description</h3>

      <p>{club.description}</p>

      <h3 className="text-xl font-semibold">Matches</h3>

      {userIsAdmin(club, session) && (
        <Link to={`/games/create?club=${club.id}`}>
          <div className="flex items-center underline underline-offset-2 hover:text-gray-500 mt-6 gap-2">
            <Plus className="w-5 h-5" />
            <p>Créer un match</p>
          </div>
        </Link>
      )}

      <p>Coming soon...</p>

      {userIsAdmin(club, session) && (
        <>
          <h3 className="text-xl font-semibold">Administration</h3>
          <p>Coming soon...</p>
        </>
      )}
    </div>
  );
}
