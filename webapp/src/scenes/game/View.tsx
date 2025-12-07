import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Calendar,
  ChevronDownIcon,
  Clock,
  Hourglass,
  MapPin,
  Pen,
  Pencil,
  Shield,
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
import ScoreBoard from "./components/ScoreBoard";

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
          {game.season?.name ? `Saison ${game.season?.name}` : ""}
        </p>

        <h1 className="font-new-amsterdam leading-12 mt-1 text-5xl">
          {new Date(game.date).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h1>

        <ButtonGroup className="mx-auto mt-2">
          {isPlayer ? (
            <AddToCalendar game={game} />
          ) : (
            <JoinGameButton game={game} variant="outline" />
          )}
          {isFuture(game.date) && (
            <InviteMenu
              gameId={game.id}
              clubId={game.club_id}
              disabled={!isMember}
            />
          )}
          {session && isPlayer && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="!pl-2">
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <LeaveGameButton gameId={game.id} variant="ghost" />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </ButtonGroup>

        <div>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            {getGameStatusString(game)}
          </p>
          {isFuture(endDate) && (
            <p
              className={`text-sm leading-relaxed ${isPlayer ? "text-primary" : "text-muted-foreground"}`}
            >
              {getPlayerStatusString()}
            </p>
          )}
        </div>
      </header>

      <br></br>
      {isAuthenticated && <GameTabs game={game} players={players} />}
    </div>
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
    <Tabs defaultValue={isPast(endDate) ? "stats" : "infos"}>
      <TabsList className="mx-auto w-auto">
        <TabsTrigger value="infos">
          <MapPin className="mr-2 inline-block h-4 w-4" />
          Infos
        </TabsTrigger>
        <TabsTrigger value="players" disabled={!isMember}>
          <Users className="mr-2 inline-block h-4 w-4" />
          Joueurs
        </TabsTrigger>

        <TabsTrigger value="lineup" disabled={!isMember}>
          <Pencil className="mr-2 inline-block h-4 w-4" />
          Compos
        </TabsTrigger>

        <TabsTrigger value="stats">
          <BarChart className="mr-2 inline-block h-4 w-4" />
          Data
        </TabsTrigger>
      </TabsList>

      <div className="bg-muted/30 mt-2 rounded-lg border p-4">
        <TabsContent value="infos">
          <div className="text-sm leading-loose">
            <p>
              <Shield className="mr-2 inline-block h-5 w-5 align-text-top" />
              <Link
                to={`~/club/${game.club_id}`}
                className="underline underline-offset-4"
              >
                {game.club?.name}
              </Link>
            </p>
            <p>
              <Calendar className="mr-2 inline-block h-5 w-5 align-text-top" />
              Saison {game.season?.name || "Non spécifiée"}
            </p>
            <p>
              <MapPin className="mr-2 inline-block h-5 w-5 align-text-top" />
              {game.location}
            </p>
            <p>
              <Clock className="mr-2 inline-block h-5 w-5 align-text-top" />
              {format(new Date(game.date), "dd/MM/yyyy '-' HH:mm")}
            </p>
            <p>
              <Hourglass className="mr-2 inline-block h-5 w-5 align-text-top" />
              Durée : {durationInMinutes} minute
              {durationInMinutes > 1 ? "s" : ""}
            </p>
            <br />
            <Link to="/edit" className={buttonVariants({ variant: "outline" })}>
              <Pen />
              Modifier
            </Link>
          </div>
        </TabsContent>

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
          <div className="grid gap-4 md:grid-cols-2">
            <ScoreBoard game={game} players={confirmedPlayers} />
            {!!player && <MyEvents player={player} />}
            <div className="min-w-0 md:col-span-2">
              <GameStats gameId={game.id} />
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
