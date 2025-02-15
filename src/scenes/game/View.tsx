import { SessionContext } from "@/components/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import {
  ArrowLeft,
  BarChart,
  Clock,
  Copy,
  Hourglass,
  MapPin,
  Pencil,
  Users,
} from "lucide-react";
import { useContext, useEffect } from "react";
import { Link, useParams } from "wouter";
import { useMembers } from "../club/lib/member/useMembers";
import AddToCalendar from "./components/AddToCalendar";
import GameStats from "./components/GameStats";
import JoinGameButton from "./components/JoinGameButton";
import LeaveGameButton from "./components/LeaveGameButton";
import LineUp from "./components/LineUp";
import MyEvents from "./components/MyEvents";
import PlayerTable from "./components/PlayerTable";
import Score from "./components/Score";
import { getGameDurationInMinutes } from "./lib/game/game.service";
import useGame from "./lib/game/useGame";
import { getPlayerChannel } from "./lib/player/player.service";
import usePlayers from "./lib/player/usePlayers";

export default function View() {
  const { id } = useParams();
  const { session } = useContext(SessionContext);
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const { data: game, hasEnded } = useGame(Number(id));
  const { data: players, isPlayer } = usePlayers(Number(id));
  const { isMember } = useMembers(game?.club_id);
  const confirmedPlayers =
    players?.filter((p) => p.status === "confirmed") || [];
  const player = players?.find((p) => p.user_id === session?.user.id);

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

  const durationInMinutes = getGameDurationInMinutes(game.duration as string);

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
        to={`~/club/${game.club_id}`}
        className="text-muted-foreground text-sm"
      >
        <ArrowLeft className="mr-2 inline-block h-4 w-4 align-text-top" />
        Retour au club
      </Link>

      <header className="mt-6 text-center">
        <p className="text-muted-foreground text-xs font-bold tracking-tight uppercase">
          {game.club?.name}
          {game.season?.name ? ` • Saison ${game.season?.name}` : ""}
        </p>

        <h1 className="text-4xl font-semibold tracking-tight uppercase">
          {new Date(game.date).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h1>

        <p
          className={`mt-1 line-clamp-1 text-sm ${isPlayer ? "text-primary" : ""}`}
        >
          {game.status === "deleted"
            ? "Match supprimé"
            : hasEnded
              ? `Match terminé${game.score ? ` • ${game.score[0]} - ${game.score[1]}` : ""}`
              : userStatus}
        </p>
      </header>

      <div className="mx-auto mt-8 grid gap-2 md:w-1/2">
        <div className="rounded-xl border p-4 text-left text-sm">
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

          <p className="mt-1">
            <Hourglass className="mr-2 inline-block h-4 w-4 align-text-top" />
            Durée : {durationInMinutes} minute{durationInMinutes > 1 ? "s" : ""}
          </p>

          <p className="mt-1">
            <Users className="mr-2 inline-block h-4 w-4 align-text-top" />
            {confirmedPlayers.length} / {game.total_players} joueurs inscrits.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {!isPlayer && <JoinGameButton game={game} />}
          {session && isPlayer && <LeaveGameButton gameId={game.id} />}
          <AddToCalendar game={game} />

          {session && isMember && (
            <Link
              to="/edit"
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
      </div>

      <Tabs defaultValue={hasEnded ? "stats" : "players"} className="mt-8">
        <TabsList className="mx-auto">
          <TabsTrigger value="players" disabled={!isMember} className="w-32">
            <Users className="mr-2 inline-block h-4 w-4" />
            Joueurs
          </TabsTrigger>

          <TabsTrigger value="stats" className="w-32">
            <BarChart className="mr-2 inline-block h-4 w-4" />
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="players">
          <div className="mt-4 grid grid-cols-1 gap-4">
            <LineUp
              game={game}
              players={confirmedPlayers}
              disabled={!isMember}
            />
            <PlayerTable players={players} />
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          {/* {hasStarted ? ( */}
          <div className="grid grid-cols-2 gap-4">
            <Score game={game} players={confirmedPlayers} />
            {!!player && <MyEvents player={player} />}
            <GameStats gameId={Number(id)} />
          </div>
          {/* ) : (
            <p className="mt-4   text-center text-muted-foreground">
              Le match commence dans{" "}
              {Math.floor(
                (new Date(game.date).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24),
              )}{" "}
              jours.
            </p>
          )} */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
