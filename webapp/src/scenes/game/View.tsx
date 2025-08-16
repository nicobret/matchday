import { SessionContext } from "@/components/auth-provider";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getGameDurationInMinutes,
  getGameStatusString,
} from "@/lib/game/gameService";
import useGame from "@/lib/game/useGame";
import { useMembers } from "@/lib/member/useMembers";
import { getPlayerChannel } from "@/lib/player/player.service";
import usePlayers from "@/lib/player/usePlayers";
import { addMinutes, isFuture, isPast } from "date-fns";
import {
  BarChart,
  Clock,
  Hourglass,
  MapPin,
  Pencil,
  Users,
} from "lucide-react";
import { useContext, useEffect } from "react";
import { Link, useParams } from "wouter";
import AddToCalendar from "./components/AddToCalendar";
import GameStats from "./components/GameStats";
import InviteMenu from "./components/InviteMenu";
import JoinGameButton from "./components/JoinGameButton";
import LeaveGameButton from "./components/LeaveGameButton";
import LineUp from "./components/LineUp";
import MyEvents from "./components/MyEvents";
import PlayerTable from "./components/PlayerTable";
import Score from "./components/Score";

export default function View() {
  const { id } = useParams();
  const { session } = useContext(SessionContext);
  const {
    data: game,
    isPending: isGamePending,
    isError: isGameError,
  } = useGame(Number(id));
  const {
    data: players,
    isPlayer,
    isPending: isPlayersPending,
    isError: isPlayersError,
  } = usePlayers(Number(id));
  const { isMember } = useMembers(game?.club_id);
  const confirmedPlayers =
    players?.filter((p) => p.status === "confirmed") || [];
  const player = players?.find((p) => p.user_id === session?.user.id);

  useEffect(() => {
    if (!id) return;
    const playerChannel = getPlayerChannel(Number(id));
    playerChannel.subscribe();
    return () => {
      playerChannel.unsubscribe();
    };
  }, [id]);

  if (!id) {
    return <div>Erreur</div>;
  }
  if (isGamePending || isPlayersPending) {
    return (
      <div className="p-4">
        <p className="animate_pulse text-center">Chargement des données...</p>
      </div>
    );
  }
  if (isGameError || isPlayersError) {
    return (
      <div className="p-4">
        <p className="text-center text-red-500">
          Une erreur est survenue lors du chargement des données du match.
        </p>
      </div>
    );
  }

  const durationInMinutes = getGameDurationInMinutes(game.duration as string);

  const endDate = addMinutes(new Date(game.date), durationInMinutes);

  function getPlayerStatusString() {
    if (isPlayer) {
      return "✓ Vous êtes inscrit(e)";
    }
    if (isMember) {
      return "Vous n'êtes pas inscrit(e)";
    }
    if (session) {
      return "Vous n'êtes pas membre du club";
    }
    return "Vous n'êtes pas connecté(e)";
  }

  return (
    <div className="mx-auto max-w-4xl p-2">
      <header className="mt-6 text-center">
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-tight">
          <Link
            to={`~/club/${game.club_id}`}
            className="underline decoration-dotted underline-offset-4"
          >
            {game.club?.name}
          </Link>
          {game.season?.name ? ` • Saison ${game.season?.name}` : ""}
        </p>

        <h1 className="font-new-amsterdam leading-12 mt-2 text-5xl">
          {new Date(game.date).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h1>

        <div>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            {getGameStatusString(game)}
          </p>
          {isFuture(endDate) && (
            <p
              className={`text-sm ${isPlayer ? "text-primary" : "text-muted-foreground"}`}
            >
              {getPlayerStatusString()}
            </p>
          )}

          <div className="mt-4 flex items-center justify-center gap-2">
            {!isPlayer && <JoinGameButton game={game} />}
            {isFuture(game.date) && (
              <InviteMenu
                gameId={game.id}
                clubId={game.club_id}
                disabled={!isMember}
              />
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto mt-8">
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

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
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

      <Tabs
        defaultValue={isPast(endDate) ? "stats" : "players"}
        className="mt-8"
      >
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
