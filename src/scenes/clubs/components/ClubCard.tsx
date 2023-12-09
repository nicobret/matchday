import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { clubType, useClubs } from "../useClubs";

export default function ClubCard(club: clubType) {
  const { joinClub, leaveClub } = useClubs();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{club.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{club.club_enrolments.length} membres</CardDescription>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button onClick={() => joinClub(club.id)}>
          <PlusIcon />
          Rejoindre
        </Button>
        <Button
          onClick={() => leaveClub(club.id)}
          variant="secondary"
          className="flex"
        >
          Quitter
        </Button>
      </CardFooter>
    </Card>
  );
}
