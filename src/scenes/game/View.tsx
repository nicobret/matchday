import { SessionContext } from "@/components/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import {
  ArrowLeft,
  Ban,
  BarChart,
  ClipboardSignature,
  Clock,
  Copy,
  List,
  MapPin,
  Pencil,
  Users,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useClub from "../club/lib/useClub";
import AddToCalendar from "./components/AddToCalendar";
import GameStats from "./components/GameStats";
import LineUp from "./components/LineUp";
import MyEvents from "./components/MyEvents";
import PlayerTable from "./components/PlayerTable";
import Score from "./components/Score";
import { getPlayerChannel, removePlayerFromGame } from "./lib/player.service";
import useCreatePlayer from "./lib/useCreatePlayer";
import useGame from "./lib/useGame";
import usePlayers from "./lib/usePlayers";

export default function View() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const { data: game, hasStarted, hasEnded } = useGame(Number(id));
  const { data: players, isPlayer } = usePlayers(Number(id));
  const { isMember } = useClub(Number(game?.club_id));
  const confirmedPlayers =
    players?.filter((p) => p.status === "confirmed") || [];
  const player = players?.find((p) => p.user_id === session?.user.id);
  const { mutate, isLoading } = useCreatePlayer(Number(game?.id));

  useEffect(() => {
    if (!id) return;
    const playerChannel = getPlayerChannel(parseInt(id));
    playerChannel.subscribe();
    return () => {
      playerChannel.unsubscribe();
    };
  }, [id]);

  if (!id) {
    return <div>Erreur</div>;
  }
  if (!game || !players) {
    return (
      <div className="p-4">
        <p className="animate_pulse text-center">Chargement des données...</p>
      </div>
    );
  }

  async function handleJoin() {
    if (!session?.user) {
      if (window.confirm("Pour vous inscrire, veuillez vous connecter.")) {
        navigate("/auth?redirectTo=" + window.location.pathname);
      }
      return;
    }
    if (!isMember) {
      if (
        window.confirm(
          "Pour vous inscrire à un match, veuillez rejoindre le club organisateur.",
        )
      ) {
        navigate(`/club/${game?.club_id}`);
      }
      return;
    }
    mutate({ user_id: session.user.id });
  }

  async function handleLeave() {
    if (!window.confirm("Voulez-vous vraiment vous désinscrire ?")) {
      return;
    }
    if (!game || !session?.user) {
      return;
    }
    setLoading(true);
    await removePlayerFromGame(game.id, session.user.id);
    setLoading(false);
  }

  const userStatus = isPlayer
    ? "✓ Vous êtes inscrit(e)"
    : isMember
      ? "Vous n'êtes pas inscrit(e)"
      : session
        ? "Vous n'êtes pas membre du club"
        : "Vous n'êtes pas connecté(e)";

  return (
    <div className="mx-auto max-w-5xl p-4">
      <Link
        to={`/club/${game.club_id}`}
        className="text-sm text-muted-foreground"
      >
        <ArrowLeft className="mr-2 inline-block h-4 w-4 align-text-top" />
        Retour au club
      </Link>

      <header className="mt-6 text-center">
        <p className="text-xs font-bold uppercase tracking-tight text-muted-foreground">
          {game.club?.name}
          {game.season?.name ? ` • Saison ${game.season?.name}` : ""}
        </p>

        <h1 className="text-4xl font-semibold uppercase tracking-tight">
          {new Date(game.date).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h1>

        <p
          className={`mt-1 line-clamp-1 text-sm ${isPlayer ? "text-primary" : ""}`}
        >
          {hasEnded
            ? `Match terminé${game.score ? ` • ${game.score[0]} - ${game.score[1]}` : ""}`
            : userStatus}
        </p>
      </header>

      <div className="mx-auto mt-8 rounded-xl border p-4 text-left text-sm md:w-1/2">
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
          {confirmedPlayers.length} / {game.total_players} joueurs inscrits.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-4">
        {!isPlayer && (
          <Button
            onClick={handleJoin}
            disabled={isLoading || hasStarted}
            className="flex gap-2"
          >
            <ClipboardSignature className="h-5 w-5" />
            <span>Inscription</span>
          </Button>
        )}

        {session && isPlayer && (
          <>
            <Button
              onClick={handleLeave}
              disabled={loading || hasStarted}
              variant="secondary"
            >
              <Ban className="mr-2 inline-block h-5 w-5" />
              Désinscription
            </Button>
          </>
        )}

        <AddToCalendar game={game} />

        {session && isMember && (
          <Link
            to={`/game/${game.id}/edit`}
            className={buttonVariants({ variant: "secondary" })}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </Link>
        )}

        <Button
          onClick={() => copyToClipboard(window.location.href)}
          variant="secondary"
        >
          <Copy className="mr-2 inline-block h-5 w-5" />
          {copiedText ? "Copié !" : "Copier le lien"}
        </Button>
      </div>

      <Tabs
        defaultValue={hasEnded ? "stats" : "players"}
        className="mt-8 w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value="players" disabled={!isMember} className="w-1/3">
            <Users className="mr-2 inline-block h-4 w-4" />
            Joueurs
          </TabsTrigger>

          <TabsTrigger value="results" className="w-1/3">
            <List className="mr-2 inline-block h-4 w-4" />
            Résultats
          </TabsTrigger>

          <TabsTrigger value="stats" className="w-1/3">
            <BarChart className="mr-2 inline-block h-4 w-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="players">
          <LineUp game={game} players={confirmedPlayers} disabled={!isPlayer} />
          <br />
          <PlayerTable players={players} />
        </TabsContent>

        <TabsContent value="results">
          <Score game={game} players={confirmedPlayers} />
        </TabsContent>

        <TabsContent value="stats">
          {!!player && (
            <>
              <MyEvents player={player} />
              <br />
            </>
          )}
          <GameStats gameId={Number(id)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
