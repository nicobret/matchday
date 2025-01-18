import { SessionContext } from "@/components/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useCreatePlayer from "@/scenes/game/lib/player/useCreatePlayer";
import usePlayers from "@/scenes/game/lib/player/usePlayers";
import useUpdatePlayer from "@/scenes/game/lib/player/useUpdatePlayer";
import { Loader } from "lucide-react";
import { useContext } from "react";
import { Link, useLocation } from "wouter";
import { Game } from "../lib/club.service";
import useClub from "../lib/useClub";
import useGames from "../lib/useGames";
import useJoinClub from "../lib/useJoinClub";

export default function UpcomingGamesTable({ clubId }: { clubId: number }) {
  const { data, isIdle, isLoading, isError } = useGames(clubId, "next");
  const { isMember } = useClub(clubId);

  if (isIdle || isLoading) {
    return <p className="m-4 text-center">Chargement...</p>;
  }
  if (isError) {
    return <p className="m-4 text-center">Erreur</p>;
  }
  if (!data.length) {
    return <p className="m-4 text-center">Aucun match prévu.</p>;
  }

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          {isMember && <TableHead>Inscrits</TableHead>}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((game) => (
          <Row key={game.id} game={game} />
        ))}
      </TableBody>
    </Table>
  );
}

function Row({ game }: { game: Game }) {
  const [_location, navigate] = useLocation();

  const { session } = useContext(SessionContext);
  const { isMember } = useClub(Number(game.club_id));
  const { data: players, isPlayer } = usePlayers(game.id);
  const player = players?.find((p) => p.user_id === session?.user.id);
  const count = players?.filter((e) => e.status === "confirmed").length || 0;
  const isFull = count >= (game.total_players || 10);

  const joinClub = useJoinClub(game.club_id);
  const createPlayer = useCreatePlayer(game.id);
  const updatePlayer = useUpdatePlayer(player!);

  function handleJoin() {
    if (!session?.user) {
      if (window.confirm("Pour vous inscrire, veuillez vous connecter.")) {
        navigate("~/auth?redirectTo=" + window.location.pathname);
      }
      return;
    }
    if (!isMember) {
      if (
        window.confirm(
          "Vous n'êtes pas membre du club organisateur, souhaitez-vous le rejoindre ?",
        )
      ) {
        joinClub.mutate();
      } else {
        return;
      }
    }
    createPlayer.mutate({ user_id: session.user.id });
  }

  function handleLeave() {
    updatePlayer.mutate({ status: "cancelled" });
  }

  return (
    <TableRow key={game.id}>
      <TableCell>
        {new Date(game.date).toLocaleDateString("fr-FR", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })}
      </TableCell>
      {isMember && (
        <TableCell>
          {count} / {game.total_players} {isFull && "✓"}
        </TableCell>
      )}
      <TableCell>
        <div className="flex flex-wrap gap-2">
          {!isPlayer && (
            <Button
              onClick={handleJoin}
              disabled={createPlayer.isLoading || joinClub.isLoading}
              className="w-full md:w-fit"
            >
              {createPlayer.isLoading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <>M'inscrire</>
              )}
            </Button>
          )}

          {session && isPlayer && (
            <Button
              onClick={handleLeave}
              disabled={updatePlayer.isLoading}
              variant="secondary"
              className="w-full md:w-fit"
            >
              {updatePlayer.isLoading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <>Me désinscrire</>
              )}
            </Button>
          )}
          <Link
            to={`~/game/${game.id}`}
            className={`w-full md:w-fit ${buttonVariants({ variant: "secondary" })}`}
          >
            Voir la page
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}
