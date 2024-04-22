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
import { Club } from "../../clubs.service";

export default function ClubCard({ club }: { club: Club }) {
  return (
    <Card className="w-full sm:w-72">
      <CardHeader>
        <CardTitle>
          <Link to={"/club/" + club.id.toString()}>{club.name}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {club.members.length} membres
          <br />
          <span className="text-ellipsis">{club.description}</span>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Link to={"/club/" + club.id.toString()}>
          <Button variant="secondary">Voir</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
