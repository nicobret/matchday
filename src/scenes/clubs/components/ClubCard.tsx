import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { clubTypeSummary } from "../useClubs";
import { Link } from "react-router-dom";

export default function ClubCard(club: clubTypeSummary) {
  return (
    <Card className="w-full sm:w-96 h-64">
      <CardHeader>
        <CardTitle>
          <Link to={club.id.toString()}>{club.name}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {club.members.length} membres
          <br />
          <p className="text-ellipsis">{club.description}</p>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Link to={club.id.toString()}>
          <Button variant="secondary">Voir</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
