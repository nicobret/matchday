import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { clubSummary } from "../clubs.service";

export default function ClubCard(club: clubSummary) {
  return (
    <Card className="w-full sm:w-72">
      <CardHeader>
        <CardTitle>
          <Link to={"/clubs/" + club.id.toString()}>{club.name}</Link>
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
        <Link to={"/clubs/" + club.id.toString()}>
          <Button variant="secondary">Voir</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
