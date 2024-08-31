import { SessionContext } from "@/components/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import supabase from "@/utils/supabase";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { CalendarEvent } from "calendar-link";
import {
  ArrowLeft,
  Ban,
  BarChart,
  ClipboardSignature,
  Clock,
  Copy,
  MapPin,
  Pencil,
  Users,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddToCalendar from "./components/AddToCalendar";
import LineUp from "./components/LineUp";
import Result from "./components/Result";
import {
  Game,
  Player,
  fetchGame,
  fetchPlayers,
  getGameDurationInMinutes,
} from "./games.service";

export default function View() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useContext(SessionContext);
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<Game>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [copiedText, copyToClipboard] = useCopyToClipboard();

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

  const durationInMinutes = getGameDurationInMinutes(String(game.duration));
  const endDate = new Date(game.date);
  endDate.setMinutes(endDate.getMinutes() + durationInMinutes);
  const gameHasEnded = endDate < new Date();

  const userIsPlayer = players
    .map((p) => p.profile?.id)
    .includes(session?.user.id);

  const userIsMember = game.club?.members.some(
    (m) => m.user_id === session?.user.id,
  );

  const userStatus = userIsPlayer
    ? "✓ Vous êtes inscrit(e)"
    : userIsMember
      ? "Vous n'êtes pas inscrit(e)"
      : session
        ? "Vous n'êtes pas membre du club"
        : "Vous n'êtes pas connecté(e)";

  const event: CalendarEvent = {
    title: `${game.club?.name} - Match du ${new Date(
      game.date,
    ).toLocaleDateString("fr-FR", {
      dateStyle: "long",
    })}`,
    description: `Match de ${game.category} organisé par ${game.club?.name}`,
    start: new Date(game.date),
    duration: [durationInMinutes, "minutes"],
    location:
      game.location ||
      `${game.club?.address}, ${game.club?.city} ${game.club?.postcode}`,
  };

  return (
    <div className="p-4">
      <Link
        to={`/club/${game.club?.id}`}
        className="text-sm text-muted-foreground"
      >
        <ArrowLeft className="mr-2 inline-block h-4 w-4 align-text-top" />
        Retour au club
      </Link>

      <header className="mt-8 text-center">
        <p className="text-xs font-bold uppercase tracking-tight text-muted-foreground">
          {game.club?.name}
        </p>

        <h1 className="text-4xl font-semibold uppercase tracking-tight">
          {new Date(game.date).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h1>

        <p
          className={`mt-1 line-clamp-1 text-sm ${userIsPlayer ? "text-primary" : ""}`}
        >
          {gameHasEnded ? "Match terminé" : userStatus}
        </p>

        <div className="mx-auto mt-8 max-w-lg rounded-xl border p-4 text-left text-sm">
          <p>
            <Clock className="mr-2 inline-block h-4 w-4 align-text-top" />
            {new Date(game.date).toLocaleTimeString("fr-FR", {
              timeStyle: "short",
            })}
          </p>

          <p className="mt-1">
            <MapPin className="mr-2 inline-block h-4 w-4 align-text-top" />
            {game.location}
          </p>

          {/* <p className="mt-1">
            Durée : {durationInMinutes} minute{durationInMinutes > 1 ? "s" : ""}
          </p> */}

          <p className="mt-1">
            <Users className="mr-2 inline-block h-4 w-4 align-text-top" />
            {players.length} / {game.total_players} joueurs inscrits.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 gap-2">
          {session && userIsMember && (
            <Link
              to={`/game/${game.id}/edit`}
              className={buttonVariants({ variant: "secondary" })}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          )}

          {!gameHasStarted && !userIsPlayer && (
            <Button onClick={handleJoin} className="flex gap-2">
              <ClipboardSignature className="h-5 w-5" />
              <span>Inscription</span>
            </Button>
          )}

          <Button
            onClick={() => copyToClipboard(window.location.href)}
            variant="secondary"
          >
            <Copy className="mr-2 inline-block h-5 w-5" />
            {copiedText ? "Copié !" : "Copier le lien"}
          </Button>

          {session && userIsPlayer && (
            <>
              <Button
                onClick={() => leaveGame(game.id, session.user.id)}
                variant="secondary"
              >
                <Ban className="mr-2 inline-block h-5 w-5" />
                Désinscription
              </Button>

              <AddToCalendar event={event} />
            </>
          )}
        </div>
      </header>

      <Tabs
        defaultValue={userIsMember ? "players" : "result"}
        className="mt-12"
      >
        <TabsList className="w-full">
          <TabsTrigger
            value="players"
            disabled={!userIsMember}
            className="w-1/2"
          >
            <Users className="mr-2 inline-block h-4 w-4" />
            Joueurs
          </TabsTrigger>
          <TabsTrigger value="result" className="w-1/2">
            <BarChart className="mr-2 inline-block h-4 w-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="players" className="mt-4">
          <LineUp
            game={game}
            players={players}
            setPlayers={setPlayers}
            disabled={!userIsPlayer}
          />
        </TabsContent>

        <TabsContent value="result" className="mt-4">
          <Result
            game={game}
            setGame={(newGame) => setGame({ ...game, ...newGame })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
