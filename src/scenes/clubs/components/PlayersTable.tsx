import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { playerSummary } from "@/scenes/users/users.service";
import { Link } from "react-router-dom";

export default function PlayersTable({
  players,
}: {
  players: playerSummary[];
}) {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Inscription</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell>
              <Link
                to={`/players/${player.id}`}
                className="underline underline-offset-2"
              >
                {player.profile.firstname}
              </Link>
            </TableCell>
            <TableCell>
              {new Date(player.created_at).toLocaleDateString("fr-FR")}
            </TableCell>
            <TableCell>{player.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
