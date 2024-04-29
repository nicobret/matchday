import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tables } from "types/supabase";
import supabase from "@/utils/supabase";

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

type ClubMember = Tables<"club_enrolments"> & {
  profile: Tables<"users"> | null;
};

export default function ClubMembers({ clubId }: { clubId: number }) {
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getMembers() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("club_enrolments")
          .select("*, profile: users(*)")
          .eq("club_id", clubId);

        if (error) throw new Error(error.message);
        if (data) setMembers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getMembers();
  }, [clubId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex gap-3 items-center">
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
