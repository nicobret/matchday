import { buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/lib/auth/useAuth";
import {
  type Game,
  getGameDurationInMinutes,
  getGameStatusString,
} from "@/lib/game/gameService";
import useGame from "@/lib/game/useGame";
import { useMembers } from "@/lib/member/useMembers";
import { getPlayerChannel, type Player } from "@/lib/player/player.service";
import usePlayers from "@/lib/player/usePlayers";
import { addMinutes, format, isFuture, isPast } from "date-fns";
import {
  BarChart,
  Clock,
  Hourglass,
  MapPin,
  Pencil,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "wouter";
import AddToCalendar from "./components/AddToCalendar";
import GameStats from "./components/GameStats";
import InviteExternalDialog from "./components/InviteExternalDialog";
import InviteMenu from "./components/InviteMenu";
import JoinGameButton from "./components/JoinGameButton";
import LeaveGameButton from "./components/LeaveGameButton";
import LineupEditor from "./components/LineupEditor";
import MyEvents from "./components/MyEvents";
import PlayerTable from "./components/PlayerTable";
import Score from "./components/Score";

export default function View() {
  const { id } = useParams();
  const { isAuthenticated, session } = useAuth();
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
    <div className="mx-auto grid max-w-4xl gap-4 p-2">
      <header className="mt-6 text-center">
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-tight">
          <Link
            to={`~/club/${game.club_id}`}
            className="underline underline-offset-4"
          >
            {game.club?.name}
          </Link>
          {game.season?.name ? ` • Saison ${game.season?.name}` : ""}
        </p>

        <h1 className="font-new-amsterdam leading-12 mt-1 text-5xl">
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
        </div>
      </header>

      <ButtonGroup className="mx-auto">
        <AddToCalendar game={game} />
        {session && isPlayer && <LeaveGameButton gameId={game.id} />}
        {!isPlayer && <JoinGameButton game={game} variant="outline" />}
        {isFuture(game.date) && (
          <InviteMenu
            gameId={game.id}
            clubId={game.club_id}
            disabled={!isMember}
          />
        )}
      </ButtonGroup>
      <br></br>
      <GameInfos
        game={game}
        isMember={isMember}
        durationInMinutes={durationInMinutes}
      />

      {isAuthenticated && <GameTabs game={game} players={players} />}
    </div>
  );
}

function GameInfos({
  game,
  isMember,
  durationInMinutes,
}: {
  game: Game;
  isMember: boolean;
  durationInMinutes: number;
}) {
  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Lieu du match</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <ItemDescription>
          <MapPin className="mr-2 inline-block h-4 w-4 align-text-top" />
          {game.location}
        </ItemDescription>
        <ItemDescription>
          <Clock className="mr-2 inline-block h-4 w-4 align-text-top" />
          {format(new Date(game.date), "dd/MM/yyyy '-' HH:mm")}
        </ItemDescription>
        <ItemDescription>
          <Hourglass className="mr-2 inline-block h-4 w-4 align-text-top" />
          Durée : {durationInMinutes} minute
          {durationInMinutes > 1 ? "s" : ""}
        </ItemDescription>
      </ItemContent>

      <ItemActions>
        {isMember && (
          <Link
            to="/edit"
            className={buttonVariants({ variant: "secondary", size: "sm" })}
          >
            Modifier
          </Link>
        )}
      </ItemActions>
    </Item>
  );
}

function GameTabs({ game, players }: { game: Game; players: Player[] }) {
  const { session } = useAuth();
  const { isMember } = useMembers(game.club_id);
  const confirmedPlayers =
    players?.filter((p) => p.status === "confirmed") || [];
  const player = players?.find((p) => p.user_id === session?.user.id);
  const durationInMinutes = getGameDurationInMinutes(game.duration as string);
  const endDate = addMinutes(new Date(game.date), durationInMinutes);

  return (
    <Tabs defaultValue={isPast(endDate) ? "stats" : "players"}>
      <TabsList className="mx-auto w-full md:w-auto">
        <TabsTrigger value="players" disabled={!isMember} className="w-1/2">
          <Users className="mr-2 inline-block h-4 w-4" />
          Liste
        </TabsTrigger>

        <TabsTrigger value="lineup" disabled={!isMember} className="w-1/2">
          <Pencil className="mr-2 inline-block h-4 w-4" />
          Compos
        </TabsTrigger>

        <TabsTrigger value="stats" className="w-1/2">
          <BarChart className="mr-2 inline-block h-4 w-4" />
          Data
        </TabsTrigger>
      </TabsList>

      <div className="bg-muted/50 mt-4 rounded-lg border p-4">
        <TabsContent value="players">
          <p className="text-muted-foreground mb-2 text-sm">
            {confirmedPlayers.length} / {game.total_players} joueurs inscrits.
          </p>

          <PlayerTable players={players} />
        </TabsContent>

        <TabsContent value="lineup" className="grid gap-4">
          <LineupEditor
            gameId={game.id}
            players={players}
            disabled={!isMember}
          />
          <InviteExternalDialog gameId={game.id} disabled={!isMember} />
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-4">
            <Score game={game} players={confirmedPlayers} />
            {!!player && <MyEvents player={player} />}
            <GameStats gameId={game.id} />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
