import { SessionContext } from "@/components/auth-provider";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import usePlayers from "@/scenes/game/lib/player/usePlayers";
import { Eye } from "lucide-react";
import { useContext } from "react";
import { Link } from "wouter";
import JoinGameButton from "../../game/components/JoinGameButton";
import LeaveGameButton from "../../game/components/LeaveGameButton";
import useGames from "../../game/lib/game/useGames";
import { Game } from "../lib/club/club.service";
import { useMembers } from "../lib/member/useMembers";

export default function UpcomingGamesTable({ clubId }: { clubId: number }) {
  const { data: games, isPending, isError } = useGames(clubId, "next");
  const { isMember } = useMembers(clubId);

  if (isPending) {
    return <p className="m-4 text-center">Chargement...</p>;
  }
  if (isError) {
    return <p className="m-4 text-center">Une erreur s'est produite.</p>;
  }
  if (games.length === 0) {
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
  const { isMember } = useMembers(game.club_id);
  const { isPlayer, count } = usePlayers(game.id);
  const isFull = count >= (game.total_players || 10);

  return (
    <TableRow key={game.id}>
      <TableCell>
        {new Date(game.date).toLocaleDateString("fr-FR", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </TableCell>
      {isMember && (
        <TableCell>
          {count} / {game.total_players} {isFull && "✓"}
        </TableCell>
      )}
      <TableCell>
        <div className="grid gap-2 md:grid-cols-2">
          {!isPlayer && <JoinGameButton game={game} />}
          {session && isPlayer && <LeaveGameButton gameId={game.id} />}
          <Link
            to={`~/game/${game.id}`}
            className={buttonVariants({ variant: "secondary" })}
          >
            <Eye />
            Voir la page
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}
