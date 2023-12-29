import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, ChevronRight, PlusIcon } from "lucide-react";
import supabaseClient from "@/utils/supabase";
import { useClubs } from "../clubs/useClubs";
import { Button } from "@/components/ui/button";
import useStore from "@/utils/zustand";
import { userIsInClub } from "../clubs/clubs.service";
import { fetchGame, gameType, userIsInGame } from "./games.service";
import Container from "@/layout/Container";

// function userIsAdmin(club: clubType, session: any) {
//   return club.members
//     .filter((m) => m.role === "admin")
//     .map((m) => m.id)
//     .includes(session.user.id);
// }

async function joinGame(id: number) {
  const { error } = await supabaseClient.from("game_enrolments").insert({
    game_id: id,
  });

  if (error) {
    console.error(error);
    return;
  }
}

async function leaveGame(id: number) {
  const { error } = await supabaseClient
    .from("game_enrolments")
    .delete()
    .eq("game_id", id);

  if (error) {
    console.error(error);
    return;
  }
}

export default function View() {
  const { id } = useParams();
  const [game, setGame] = useState<gameType | null>(null);
  const { club } = useClubs(game?.club_id.toString());
  const { session } = useStore();

  useEffect(() => {
    if (!id) {
      console.error("No id provided");
      return;
    }
    async function getGame(id: number) {
      const data = await fetchGame(id);
      if (!data) return;
      setGame(data);
    }
    getGame(parseInt(id));
  }, [id]);

  if (!game) return <p className="text-center animate_pulse">Chargement...</p>;

  return (
    <Container>
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

      <div className="flex gap-4 items-end scroll-m-20 border-b pb-2 first:mt-0 justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">
          {new Date(game.date).toLocaleDateString("fr-FR", {
            dateStyle: "long",
          })}
        </h2>

        {session &&
          club &&
          userIsInClub(session.user, club) &&
          (userIsInGame(session.user, game) ? (
            <Button
              onClick={() => leaveGame(game.id)}
              variant="secondary"
              className="flex gap-2"
            >
              <Check className="h-5 w-5" />
              <span className="hidden md:block">Inscrit</span>
            </Button>
          ) : (
            <Button onClick={() => joinGame(game.id)} className="flex gap-2">
              <PlusIcon className="h-5 w-5" />
              <p className="hidden md:block">S'inscrire</p>
            </Button>
          ))}
      </div>
      {/* 
      <div className="flex gap-2 items-center">
      {game.players.length}
      <Users className="h-4 w-4" />
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
    </Container>
  );
}
