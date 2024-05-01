import { Link } from "react-router-dom";
import { Club } from "@/scenes/club/club.service";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Eye } from "lucide-react";

export default function ClubCard({
  club,
  isMember = false,
}: {
  club: Club;
  isMember?: boolean;
}) {
  return (
    <Card className="w-full sm:w-72 flex flex-col">
      <CardHeader>
        <CardTitle className="truncate">
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
      <CardFooter className="flex justify-end mt-auto">
        {isMember ? (
          <Link
            to={"/club/" + club.id.toString()}
            className={`${buttonVariants()} w-full`}
          >
            Aller
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        ) : (
          <Link
            to={"/club/" + club.id.toString()}
            className={`${buttonVariants({ variant: "secondary" })} w-full`}
          >
            Voir
            <Eye className="h-5 w-5 ml-2" />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
