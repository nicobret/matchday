import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clubMember } from "@/scenes/users/users.service";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PlayersTable({ players }: { players: clubMember[] }) {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>Prénom</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Inscription</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell>{player.profile.firstname}</TableCell>
            <TableCell>{player.profile.lastname}</TableCell>
            <TableCell>
              {new Date(player.created_at).toLocaleDateString("fr-FR")}
            </TableCell>
            <TableCell>{player.role}</TableCell>
            <TableCell>
              <Link
                to={`/players/${player.id}`}
                className={buttonVariants({ variant: "secondary" })}
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
}
