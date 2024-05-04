import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Member, fetchMembers } from "../club.service";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Users } from "lucide-react";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5" />
            Membres
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : members.length === 0 ? (
          <p className="text-center">Aucun joueur dans ce club.</p>
        ) : (
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>
                    {player.profile.firstname} {player.profile.lastname}
                  </TableCell>
                  <TableCell>{player.role}</TableCell>
                  <TableCell>
                    <Link
                      to={`/player/${player.profile.id}`}
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
