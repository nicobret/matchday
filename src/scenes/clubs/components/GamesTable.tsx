import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Tables } from "types/supabase";

export default function GamesTable({ games }: { games: Tables<"games">[] }) {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => (
          <TableRow key={game.id}>
            <TableCell>
              {new Date(game.date).toLocaleDateString("fr-FR")}
            </TableCell>
            <TableCell>
              {game.score && game.score.length === 2
                ? game.score[0].toString() + " - " + game.score[1].toString()
                : "N/A"}
            </TableCell>
            <TableCell>
              <Link
                to={`/games/${game.id}`}
                className={buttonVariants({ variant: "secondary" }) + "gap-2"}
              >
                Voir
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return <p>Aucun match.</p>;
}
