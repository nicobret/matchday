import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabaseClient from "@/utils/supabase";
import { Tables } from "types/supabase";

import { gameHasStarted } from "./games.service";
import { Check, ClipboardSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/Breadcrumbs";

import Information from "./components/Information";
import Players from "./components/Players";
import Result from "./components/Result";
import LineUp from "./components/LineUp";
import { SessionContext } from "@/App";
import Container from "@/layout/Container";

export type clubType = Tables<"clubs"> & {
  members: Tables<"club_enrolments">[] | null;
};

export type gamePlayer = Tables<"game_registrations"> & {
  profile: Tables<"users"> | null;
};

export default function View() {
  const { id } = useParams();
  const { session } = useContext(SessionContext);
  const [game, setGame] = useState<Tables<"games">>();
  const [clubs, setClubs] = useState<clubType[]>();
  const [players, setPlayers] = useState<gamePlayer[]>();

  async function getData(id: number) {
    const { data: gameData, error: gameError } = await supabaseClient
      .from("games")
      .select()
      .eq("id", id)
      .single();
    if (gameError) {
      console.error(gameError);
      return;
    }

    const { data: clubsData, error: clubsError } = await supabaseClient
      .from("clubs")
      .select("*, members: club_enrolments (*)")
      .in("id", [
        gameData.club_id,
        gameData.opponent_id ? gameData.opponent_id : 0,
      ]);
    if (clubsError) {
      console.error(clubsError);
      return;
    }

    const { data: playersData, error: playersError } = await supabaseClient
      .from("game_registrations")
      .select("*, profile: users (*)")
      .eq("game_id", id);
    if (playersError) {
      console.error(playersError);
      return;
    }

    setGame(gameData);
    setClubs(clubsData);
    setPlayers(playersData);
  }

  async function joinGame(game_id: number, user_id: string) {
    const { data, error } = await supabaseClient
      .from("game_registrations")
      .insert({
        game_id,
        user_id,
        status: "confirmed",
      })
      .select("*, profile: users (*)")
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setPlayers([...players, data]);
  }

  async function leaveGame(game_id: number, user_id: string) {
    const { error } = await supabaseClient
      .from("game_registrations")
      .delete()
      .eq("game_id", game_id)
      .eq("user_id", user_id);

    if (error) {
      console.error(error);
      return;
    }

    setPlayers(players.filter((p) => p.user_id !== user_id));
  }

  useEffect(() => {
    if (!id) {
      console.error("No id provided");
      return;
    }
    getData(parseInt(id));
  }, [id]);

  if (!session?.user || !clubs || !game || !players) {
    return <p className="text-center animate_pulse">Chargement...</p>;
  }

  const hasStarted = gameHasStarted(game);

  const userIsInGame = players
    .filter((p) => p.status === "confirmed")
    .map((p) => p.profile?.id)
    .includes(session?.user.id);

  const userIsInClubs = clubs.map(
    (c) => c.members?.map((m) => m.id).includes(parseInt(session?.user.id))
  );

  const userCanJoinGame = userIsInClubs && !hasStarted && !userIsInGame;

  return (
    <Container>
      <Breadcrumbs
        links={[
          { label: "Matches", link: "/games" },
          { label: "Match #" + game?.id, link: "#" },
        ]}
      />

      <div className="flex gap-4 items-end scroll-m-20 border-b pb-2 mt-6 mb-2">
        <h2 className="text-3xl font-semibold tracking-tight">
          Match #{game.id}
        </h2>
        <div className="pb-1">
          <Badge className="text-sm">{game.status}</Badge>
        </div>

        {userIsInGame && (
          <Button
            onClick={() => leaveGame(game.id, session?.user.id)}
            variant="secondary"
            className="flex gap-2 ml-auto"
          >
            <Check className="h-5 w-5" />
            <span className="hidden md:block">Inscrit</span>
          </Button>
        )}

        {userCanJoinGame && (
          <Button
            onClick={() => joinGame(game.id, session?.user.id)}
            className="flex gap-2 ml-auto"
          >
            <ClipboardSignature className="h-5 w-5" />
            <span className="hidden md:block">S'inscrire</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
        <Information game={game} clubs={clubs} />
        <Players game={game} players={players} />
        <LineUp
          players={players}
          setPlayers={setPlayers}
          disabled={!userIsInGame || hasStarted}
        />
        <Result game={game} />
      </div>
    </Container>
  );
}
