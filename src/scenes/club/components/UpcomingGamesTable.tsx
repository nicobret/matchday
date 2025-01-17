import { Link, useLocation } from "wouter";

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
import { queryClient } from "@/lib/react-query";
import useCreatePlayer from "@/scenes/game/lib/player/useCreatePlayer";
import usePlayers from "@/scenes/game/lib/player/usePlayers";
import useUpdatePlayer from "@/scenes/game/lib/player/useUpdatePlayer";
import { Loader } from "lucide-react";
import { useContext } from "react";
import { Game, joinClub } from "../lib/club.service";
import useClub from "../lib/useClub";
import useGames from "../lib/useGames";

export default function UpcomingGamesTable({ clubId }: { clubId: number }) {
  const { data: games } = useGames(clubId, "next");
  const { isMember } = useClub(clubId);

  if (!games?.length) {
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
        {games.map((game) => (
          <GameRow key={game.id} game={game} />
        ))}
      </TableBody>
    </Table>
  );
}

function GameRow({ game }: { game: Game }) {
  const { session } = useContext(SessionContext);
  const [_location, navigate] = useLocation();
  const { isMember } = useClub(Number(game?.club_id));
  const { data: players, isPlayer } = usePlayers(Number(game.id));
  const { data: club } = useClub(Number(game?.club_id));
  const player = players?.find((p) => p.user_id === session?.user.id);
  const count = players?.filter((e) => e.status === "confirmed").length || 0;
  const isFull = count >= (game.total_players || 10);
  const createPlayer = useCreatePlayer(Number(game.id));
  const updatePlayer = useUpdatePlayer(player!);

  async function handleJoin() {
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
        await joinClub(club!.id, session.user.id);
        queryClient.invalidateQueries(["club", club!.id]);
      }
    }
    createPlayer.mutate(
      { user_id: session.user.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["players", game.id]);
        },
      },
    );
  }

  async function handleLeave() {
    if (!game || !player) {
      console.error("Game or player not found");
      return;
    }
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
              disabled={createPlayer.isLoading}
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
