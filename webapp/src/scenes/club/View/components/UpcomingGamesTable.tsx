import { SessionContext } from "@/components/auth-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Game } from "@/lib/game/gameService";
import useGames from "@/lib/game/useGames";
import { useMembers } from "@/lib/member/useMembers";
import usePlayers from "@/lib/player/usePlayers";
import { useContext } from "react";
import { Link } from "wouter";
import JoinGameButton from "../../../game/components/JoinGameButton";
import LeaveGameButton from "../../../game/components/LeaveGameButton";

export default function UpcomingGamesTable({ clubId }: { clubId: number }) {
  const {
    data: games,
    isPending,
    isError,
  } = useGames({ clubId, when: "upcoming" });
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          {isMember && <TableHead>Inscrits</TableHead>}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          )
          .map((game) => (
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
        <Link
          to={`~/game/${game.id}`}
          className="text-primary underline underline-offset-4"
        >
          {new Date(game.date).toLocaleDateString("fr-FR", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </Link>
      </TableCell>
      {isMember && (
        <TableCell>
          {count} / {game.total_players} {isFull && "✓"}
        </TableCell>
      )}
      <TableCell>
        <div className="grid max-w-xl gap-2 md:grid-cols-2">
          {!isPlayer && (
            <JoinGameButton game={game} size="sm" showIcon={false} />
          )}
          {session && isPlayer && (
            <LeaveGameButton gameId={game.id} size="sm" showIcon={false} />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
