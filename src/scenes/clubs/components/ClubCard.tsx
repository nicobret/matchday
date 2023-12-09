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
import { joinClub, leaveClub } from "../clubs.service";

export default function LeagueCard(league: {
  id: number;
  name: string;
  club_enrolments: Array<{ user_id: string }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{league.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {league.club_enrolments.length} membres
        </CardDescription>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button onClick={() => joinClub(league.id)}>
          <PlusIcon />
          Rejoindre
        </Button>
        <Button
          onClick={() => leaveClub(league.id)}
          variant="secondary"
          className="flex"
        >
          Quitter
        </Button>
      </CardFooter>
    </Card>
  );
}
