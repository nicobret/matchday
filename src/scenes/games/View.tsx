import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import supabaseClient from "@/utils/supabase";

// function userIsInClub(club: clubType, session: any) {
//   return club.members.map((m) => m.id).includes(session.user.id);
// }

// function userIsAdmin(club: clubType, session: any) {
//   return club.members
//     .filter((m) => m.role === "admin")
//     .map((m) => m.id)
//     .includes(session.user.id);
// }

export type gameType = {
  id: number;
  created_at: Date;
  date: Date;
  location: string;
  status: string;
  club: {
    id: number;
    name: string;
  };
  creator: {
    id: string;
    firstname: string;
    lastname: string;
    avatar: string;
    status: string;
  };
};

export async function fetchGame(id: string) {
  const { data, error } = await supabaseClient
    .from("games")
    .select(
      `
        id,
        created_at,
        date,
        location,
        status,
        club:club_id (id, name),
        creator:creator_id (id, firstname, lastname, avatar, status)
      `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  return data as unknown as gameType;
}

export default function View() {
  const { id } = useParams();
  const [game, setGame] = useState<gameType | null>(null);

  useEffect(() => {
    if (!id) {
      console.error("No id provided");
      return;
    }
    async function getGame(id: string) {
      console.log("Fetching club data");
      const data = await fetchGame(id);
      if (!data) return;
      setGame(data);
    }
    getGame(id);
  }, [id]);

  if (!game) return <p className="text-center animate_pulse">Chargement...</p>;

  return (
    <div className="md:border rounded p-6 space-y-6">
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Link to="/clubs">
          <p>Matches</p>
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="#">
          <p>
            Match du{" "}
            {new Date(game.date).toLocaleDateString("fr-FR", {
              dateStyle: "long",
            })}
          </p>
        </Link>
      </div>

      <div className="flex gap-4 items-end scroll-m-20 border-b pb-2 first:mt-0">
        <h2 className="text-3xl font-semibold tracking-tight">
          Match du{" "}
          {new Date(game.date).toLocaleDateString("fr-FR", {
            dateStyle: "long",
          })}
        </h2>
      </div>

      {/* <div className="flex gap-2 items-center">
          {game.players.length}
          <Users className="h-4 w-4" />
        </div> */}

      {/* {session &&
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
      </div> */}

      <p>
        Créé par{" "}
        <Link to={`users/${game.creator.id}`}>
          <span className="text-gray-500 underline underline-offset-4 hover:text-gray-800">
            {game.creator.firstname} {game.creator.lastname}
          </span>
        </Link>{" "}
        le{" "}
        {new Date(game.created_at).toLocaleDateString("fr-FR", {
          dateStyle: "long",
        })}
      </p>

      <h3 className="text-xl font-semibold">Lieu</h3>

      <p>{game.location}</p>
    </div>
  );
}
