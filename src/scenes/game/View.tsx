import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "@/utils/supabase";
import { Tables } from "types/supabase";
import { SessionContext } from "@/components/auth-provider";
import { gameHasStarted } from "./games.service";
import { Check, ClipboardSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Information from "./components/Information";
import Players from "./components/Players";
import Result from "./components/Result";
import LineUp from "./components/LineUp";

export type clubType = Tables<"clubs"> & {
  members: Tables<"club_enrolments">[] | null;
};

export type gamePlayer = Tables<"game_registrations"> & {
  profile: Tables<"users"> | null;
};

export default function View() {
  const { id } = useParams();
  const { session } = useContext(SessionContext);
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<Tables<"games">>();
  const [club, setClub] = useState<clubType>();
  const [players, setPlayers] = useState<gamePlayer[]>();

  async function getData(id: number) {
    try {
      setLoading(true);
      const { data: game } = await supabase
        .from("games")
        .select()
        .eq("id", id)
        .single()
        .throwOnError();
      const { data: club } = await supabase
        .from("clubs")
        .select("*, members: club_enrolments (*)")
        .eq("id", game.club_id)
        .single()
        .throwOnError();
      const { data: players } = await supabase
        .from("game_registrations")
        .select("*, profile: users (*)")
        .eq("game_id", id)
        .throwOnError();
      setGame(game);
      setClub(club);
      setPlayers(players);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function joinGame(game_id: number, user_id: string) {
    const { data, error } = await supabase
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
    const { error } = await supabase
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
    if (id) {
      getData(parseInt(id));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-4">
        <p className="animate_pulse text-center">Chargement des données...</p>
      </div>
    );
  }

  if (!game) {
    return <div />;
  }

  const hasStarted = gameHasStarted(game);

  const userIsInGame = players
    .filter((p) => p.status === "confirmed")
    .map((p) => p.profile?.id)
    .includes(session?.user.id);

  const userIsInClub = club?.members
    ?.map((m) => m.user_id)
    .includes(session?.user.id);

  const userCanJoinGame = userIsInClub && !hasStarted && !userIsInGame;

  return (
    <div className="p-4">
      <Breadcrumbs
        links={[
          { label: club?.name, link: `/club/${club?.id}` },
          {
            label:
              "Match du " +
              new Date(game.date).toLocaleDateString("fr-FR", {
                dateStyle: "long",
              }),
            link: "#",
          },
        ]}
      />

      <div className="mb-2 mt-6 flex scroll-m-20 items-end gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          {new Date(game.date).toLocaleDateString("fr-FR", {
            dateStyle: "long",
          })}
        </h1>

        {userIsInGame && (
          <Button
            onClick={() => leaveGame(game.id, session?.user.id)}
            variant="secondary"
            className="ml-auto flex gap-2"
          >
            <Check className="h-5 w-5" />
            <span className="hidden md:block">Inscrit</span>
          </Button>
        )}

        {userCanJoinGame && (
          <Button
            onClick={() => joinGame(game.id, session?.user.id)}
            className="ml-auto flex gap-2"
          >
            <ClipboardSignature className="h-5 w-5" />
            <span className="hidden md:block">S'inscrire</span>
          </Button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 py-2 md:grid-cols-3">
        <Information game={game} club={club} />
        <Players game={game} players={players} />
        <Result game={game} />
        <LineUp
          players={players}
          setPlayers={setPlayers}
          disabled={!userIsInGame || hasStarted}
        />
      </div>
    </div>
  );
}
