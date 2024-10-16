import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Member, fetchMembers } from "../lib/club.service";

function getUsername(member: Member) {
  if (member.profile?.firstname && member.profile?.lastname) {
    return `${member.profile?.firstname} ${member.profile?.lastname}`;
  }
  if (member.profile?.firstname) {
    return member.profile?.firstname;
  }
  return "Utilisateur sans nom";
}

export default function ClubMembers({ clubId }: { clubId: number }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchMembers(clubId)
      .then((data) => setMembers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [clubId]);

  if (loading) {
    return <p className="text-center">Chargement...</p>;
  }
  return (
    <Card id="members">
      <CardHeader>
        <CardTitle>
          <p>Liste des membres</p>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : members.length === 0 ? (
          <p className="text-center">Aucun joueur dans ce club.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{getUsername(member)}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <Link
                      to={`/player/${member.profile?.id}?fromClub=${clubId}`}
                      className={buttonVariants({ variant: "secondary" })}
                    >
                      Voir
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <CardFooter className="mt-auto flex justify-end gap-2">
        <Button variant="secondary" disabled>
          Inviter
        </Button>
      </CardFooter>
    </Card>
  );
}
