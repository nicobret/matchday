import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { gameSummary } from "@/scenes/games/games.service";
import { Link } from "react-router-dom";

export default function GamesTable({ games }: { games: gameSummary[] }) {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Score</TableHead>
          {games.some((g) => g.opponent?.id) && (
            <TableHead>Adversaire</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => (
          <TableRow key={game.id}>
            <TableCell>
              <Link
                to={`/games/${game.id}`}
                className="underline underline-offset-2 hover:text-primary"
              >
                Match #{game.id}
              </Link>
            </TableCell>
            <TableCell>
              {new Date(game.date).toLocaleDateString("fr-FR")}
            </TableCell>
            <TableCell>
              {game.score && game.score.length === 2
                ? game.score[0].toString() + " - " + game.score[1].toString()
                : "N/A"}
            </TableCell>
            {game.opponent?.id && (
              <TableCell>
                <Link
                  to={`/clubs/${game.opponent.id}`}
                  className="underline underline-offset-2 hover:text-primary"
                >
                  {game.opponent.name}
                </Link>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return <p>Aucun match.</p>;
}
