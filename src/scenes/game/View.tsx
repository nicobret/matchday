import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "@/utils/supabase";
import { SessionContext } from "@/components/auth-provider";
import { Game, Player, fetchGame, fetchPlayers } from "./games.service";
import { Check, ClipboardSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Information from "./components/Information";
import Players from "./components/Players";
import Result from "./components/Result";
import LineUp from "./components/LineUp";

export default function View() {
  const { id } = useParams();
  const { session } = useContext(SessionContext);
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<Game>();
  console.log("🚀 ~ View ~ game:", game);
  const [players, setPlayers] = useState<Player[]>([]);
  console.log("🚀 ~ View ~ players:", players);

  async function handleJoin(game_id: number, user_id: string) {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("game_registrations")
        .insert({ game_id, user_id, status: "confirmed" })
        .select("*, profile: users (*)")
        .single()
        .throwOnError();
      if (!data) {
        throw new Error("Player not found");
      }
      setPlayers([...players, data]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function leaveGame(game_id: number, user_id: string) {
    await supabase
      .from("game_registrations")
      .delete()
      .eq("game_id", game_id)
      .eq("user_id", user_id)
      .throwOnError();
    setPlayers(players.filter((p) => p.user_id !== user_id));
  }

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchGame(parseInt(id))
      .then((data) => {
        if (!data.club) {
          throw new Error("Club not found");
        }
        setGame(data);
      })
      .catch((error) => console.error(error));
    fetchPlayers(parseInt(id))
      .then((data) => setPlayers(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-4">
        <p className="animate_pulse text-center">Chargement des données...</p>
      </div>
    );
  }

  if (!game || !players) {
    return <div />;
  }

  const hasStarted = new Date(game.date) < new Date();
  const isPlayer = players.map((p) => p.profile?.id).includes(session?.user.id);
  const isMember = game.club?.members.some(
    (m) => m.user_id === session?.user.id,
  );
  const canJoinGame = session?.user && isMember && !hasStarted && !isPlayer;

  return (
    <div className="p-4">
      <Breadcrumbs
        links={[
          { label: game.club?.name || "Club", link: `/club/${game.club?.id}` },
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

        {session && isPlayer && (
          <Button
            onClick={() => leaveGame(game.id, session.user.id)}
            variant="secondary"
            className="ml-auto flex gap-2"
          >
            <Check className="h-5 w-5" />
            <span className="hidden md:block">Inscrit</span>
          </Button>
        )}

        {session && canJoinGame && (
          <Button
            onClick={() => handleJoin(game.id, session.user.id)}
            className="ml-auto flex gap-2"
          >
            <ClipboardSignature className="h-5 w-5" />
            <span className="hidden md:block">S'inscrire</span>
          </Button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 py-2 md:grid-cols-3">
        <Information game={game} />
        <Players game={game} players={players} />
        <Result game={game} />
        <LineUp
          players={players}
          setPlayers={setPlayers}
          disabled={!isPlayer || hasStarted}
        />
      </div>
    </div>
  );
}
