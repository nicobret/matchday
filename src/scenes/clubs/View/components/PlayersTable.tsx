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
import { ClubMember } from "./ClubMembers";

export default function PlayersTable({ players }: { players: ClubMember[] }) {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell>
              {player.profile.firstname} {player.profile.lastname}
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
