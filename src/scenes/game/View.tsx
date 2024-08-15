import { SessionContext } from "@/components/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import supabase from "@/utils/supabase";
import { ArrowLeftCircle, Ban, ClipboardSignature, Pencil } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Information from "./components/Information";
import LineUp from "./components/LineUp";
import Players from "./components/Players";
import Result from "./components/Result";
import { Game, Player, fetchGame, fetchPlayers } from "./games.service";

export default function View() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useContext(SessionContext);
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<Game>();
  const [players, setPlayers] = useState<Player[]>([]);

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

  async function handleJoin() {
    if (!session?.user) {
      if (window.confirm("Pour vous inscrire, veuillez vous connecter.")) {
        navigate("/auth?redirectTo=" + window.location.pathname);
      }
      return;
    }

    if (!userIsMember) {
      if (
        window.confirm(
          "Pour vous inscrire à un match, veuillez rejoindre le club organisateur.",
        )
      ) {
        navigate(`/club/${game?.club?.id}`);
      }
      return;
    }

    setLoading(true);
    try {
      const { data } = await supabase
        .from("game_registrations")
        .insert({
          game_id: game?.id,
          user_id: session?.user.id,
          status: "confirmed",
        })
        .select("*, profile: users (*)")
        .single()
        .throwOnError();
      if (!data) {
        throw new Error("Player not found");
      }
      setPlayers([...players, data]);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
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

  const gameHasStarted = new Date(game.date) < new Date();

  const userIsPlayer = players
    .map((p) => p.profile?.id)
    .includes(session?.user.id);

  const userIsMember = game.club?.members.some(
    (m) => m.user_id === session?.user.id,
  );

  const userStatus = userIsPlayer
    ? "Vous êtes inscrit(e)."
    : userIsMember
      ? "Vous n'êtes pas inscrit(e)."
      : session
        ? "Vous n'êtes pas membre du club."
        : "Vous n'êtes pas connecté(e).";

  return (
    <div className="px-4">
      <Link
        to={`/club/${game.club?.id}`}
        className="text-sm text-muted-foreground"
      >
        <ArrowLeftCircle className="mr-2 inline-block h-4 w-4 align-text-top" />
        Retour au club
      </Link>

      <header className="mt-8">
        <p className="text-sm font-bold uppercase tracking-tight text-muted-foreground">
          Match
        </p>

        <h1 className="line-clamp-1 text-3xl font-semibold uppercase tracking-tight">
          {new Date(game.date).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h1>

        <p className="mt-1 line-clamp-1 text-sm">{userStatus}</p>

        <div className="mt-3 flex gap-3">
          {session && userIsMember && (
            <Link
              to={`/game/${game.id}/edit`}
              className={buttonVariants({ variant: "secondary" })}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          )}

          {session && userIsPlayer && (
            <Button
              onClick={() => leaveGame(game.id, session.user.id)}
              variant="secondary"
              className="flex gap-2"
            >
              <Ban className="h-5 w-5" />
              <span>Désinscription</span>
            </Button>
          )}

          {!gameHasStarted && !userIsPlayer && (
            <Button onClick={handleJoin} className="flex gap-2">
              <ClipboardSignature className="h-5 w-5" />
              <span>Inscription</span>
            </Button>
          )}
        </div>
      </header>

      <Tabs defaultValue="info" className="mt-12">
        <TabsList className="w-full">
          <TabsTrigger value="info">Infos</TabsTrigger>
          <TabsTrigger value="result">Score</TabsTrigger>
          <TabsTrigger value="players" disabled={!userIsMember}>
            Joueurs
          </TabsTrigger>
          <TabsTrigger value="lineup" disabled={!userIsMember}>
            Compo
          </TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <Information game={game} />
        </TabsContent>
        <TabsContent value="result">
          <Result
            game={game}
            setGame={(newGame) => setGame({ ...game, ...newGame })}
          />
        </TabsContent>
        <TabsContent value="players">
          <Players game={game} players={players} />
        </TabsContent>
        <TabsContent value="lineup">
          <LineUp
            players={players}
            setPlayers={setPlayers}
            disabled={!userIsPlayer || gameHasStarted}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
