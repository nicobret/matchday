import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "wouter";
import { getUsername } from "../lib/club/club.service";
import useClub from "../lib/club/useClub";
import { useMembers } from "../lib/member/useMembers";
import { RoleSelector } from "./RoleSelector";

export default function ClubMembers({ clubId }: { clubId: number }) {
  const { data, isError, isLoading, isIdle } = useMembers(clubId);
  const { isAdmin } = useClub(clubId);

  if (isIdle || isLoading) {
    return <p className="text-center">Chargement...</p>;
  }
  if (isError) {
    return <p className="text-center">Erreur</p>;
  }
  return (
    <>
      <div className="mt-4">
        <Button variant="secondary" disabled>
          Inviter
        </Button>
      </div>
      {isLoading ? (
        <p className="text-center">Chargement...</p>
      ) : data.length === 0 ? (
        <p className="text-center">Aucun joueur dans ce club.</p>
      ) : (
        <Table className="mt-4 mb-24 border">
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{getUsername(member)}</TableCell>
                <TableCell>
                  <RoleSelector member={member} enabled={isAdmin} />
                </TableCell>
                <TableCell>
                  <Link
                    to={`~/player/${member.profile?.id}?fromClub=${clubId}`}
                    className={buttonVariants({ variant: "secondary" })}
                  >
                    Voir
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
