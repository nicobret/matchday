import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { gamePlayer } from "../View";

export default function PlayersTable({ players }: { players: gamePlayer[] }) {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell>
              <Link
                to={`/player/${player.profile.id}`}
                className="underline underline-offset-2"
              >
                {player.profile?.firstname}
              </Link>
            </TableCell>
            <TableCell>{player.status}</TableCell>
            <TableCell>
              {new Date(player.created_at).toLocaleDateString("fr-FR")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
