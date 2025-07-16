import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Club } from "@/lib/club/club.service";
import { ArrowRight, Eye } from "lucide-react";
import { Link } from "wouter";

export default function ClubCard({
  club,
  isMember = false,
}: {
  club: Club;
  isMember?: boolean;
}) {
  return (
    <Card className="flex w-full flex-col">
      <CardHeader>
        <CardTitle className="truncate">
          <Link to={"/club/" + club.id.toString()}>{club.name}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {club.members ? club.members.length + " membres" : "Aucun membre"}
          <br />
          <span className="text-ellipsis">{club.description}</span>
        </CardDescription>
      </CardContent>
      <CardFooter className="mt-auto flex justify-end">
        {isMember ? (
          <Link
            to={"/club/" + club.id.toString()}
            className={`${buttonVariants()} w-full`}
          >
            Aller
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        ) : (
          <Link
            to={"/club/" + club.id.toString()}
            className={`${buttonVariants()} w-full`}
          >
            Voir
            <Eye className="ml-2 h-5 w-5" />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
