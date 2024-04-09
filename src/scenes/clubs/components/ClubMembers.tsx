import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import PlayersTable from "./PlayersTable";
import { clubType } from "../clubs.service";
import { Button } from "@/components/ui/button";

export default function ClubMembers({ club }: { club: clubType }) {
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
        {club.members.length === 0 ? (
          <p className="text-center">Aucun joueur dans ce club.</p>
        ) : (
          <PlayersTable players={club.members} />
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
