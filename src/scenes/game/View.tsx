import { SessionContext } from "@/components/auth-provider";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BarChart,
  Clock,
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
import InviteMenu from "./components/InviteMenu";
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
  const { data: game, hasStarted, hasEnded } = useGame(Number(id));
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

  const gameStatus =
    game.status === "deleted"
      ? "Match supprimé"
      : hasEnded
        ? `Match terminé${game.score ? ` • ${game.score[0]} - ${game.score[1]}` : ""}`
        : hasStarted
          ? "Match en cours"
          : `Le match commence dans ${Math.floor(
              (new Date(game.date).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24),
            )} jours.`;

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

        <h1 className="font-new-amsterdam text-6xl leading-12">
          {new Date(game.date).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h1>

        <p className="text-muted-foreground text-center text-sm">
          {gameStatus}
        </p>
        {!hasEnded && (
          <p
            className={`text-sm ${isPlayer ? "text-primary" : "text-muted-foreground"}`}
          >
            {userStatus}
          </p>
        )}

        <div className="mt-2 flex items-center justify-center gap-2">
          {!isPlayer && <JoinGameButton game={game} />}
          {!hasStarted && (
            <InviteMenu
              gameId={game.id}
              clubId={game.club_id}
              disabled={!isMember}
            />
          )}
        </div>
      </header>

      <div className="mx-auto mt-8 max-w-xl">
        <div className="rounded-xl border p-4">
          <div className="text-sm leading-relaxed">
            <p>
              <Clock className="mr-2 inline-block h-4 w-4 align-text-top" />
              {new Date(game.date).toLocaleTimeString("fr-FR", {
                timeStyle: "short",
              })}
            </p>

            <p>
              <MapPin className="mr-2 inline-block h-4 w-4 align-text-top" />
              {game.location}
            </p>

            <p>
              <Hourglass className="mr-2 inline-block h-4 w-4 align-text-top" />
              Durée : {durationInMinutes} minute
              {durationInMinutes > 1 ? "s" : ""}
            </p>

            <p>
              <Users className="mr-2 inline-block h-4 w-4 align-text-top" />
              {confirmedPlayers.length} / {game.total_players} joueurs inscrits.
            </p>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <AddToCalendar game={game} />

            {session && isMember && (
              <Link
                to="/edit"
                className={buttonVariants({ variant: "outline" })}
              >
                <Pencil />
                Modifier
              </Link>
            )}

            {session && isPlayer && <LeaveGameButton gameId={game.id} />}
          </div>
        </div>
      </div>

      <Tabs defaultValue={hasEnded ? "stats" : "players"} className="mt-8">
        <TabsList className="mx-auto w-full md:w-auto">
          <TabsTrigger value="players" disabled={!isMember} className="w-1/2">
            <Users className="mr-2 inline-block h-4 w-4" />
            Joueurs
          </TabsTrigger>

          <TabsTrigger value="stats" className="w-1/2">
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
          <div className="grid grid-cols-2 gap-4">
            <Score game={game} players={confirmedPlayers} />
            {!!player && <MyEvents player={player} />}
            <GameStats gameId={Number(id)} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
