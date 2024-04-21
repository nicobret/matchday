import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import PlayersTable from "./PlayersTable";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Tables } from "types/supabase";
import supabaseClient from "@/utils/supabase";

export type ClubMember = Tables<"club_enrolments"> & {
  profile: Tables<"users"> | null;
};

export default function ClubMembers({ clubId }: { clubId: number }) {
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getMembers() {
      try {
        setLoading(true);

        const { data, error } = await supabaseClient
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
          <PlayersTable players={members} />
        )}
      </CardContent>

      <CardFooter className="mt-auto flex justify-end gap-2">
        <Button variant="secondary" disabled>
          Inviter un joueur
        </Button>
      </CardFooter>
    </Card>
  );
}
