import { Tables } from "types/supabase";
import { clubType } from "../View";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  ClipboardSignature,
  Clock,
  MapPin,
  Pencil,
} from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { AddToCalendarButton } from "add-to-calendar-button-react";

export default function Information({
  game,
  club,
}: {
  game: Tables<"games">;
  club: clubType;
}) {
  const endTimestamp = new Date(game.date).getTime() + 2 * 60 * 60 * 1000;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-3 items-center">
          {/* <Clipboard className="h-5 w-5 flex-none" /> */}
          Informations
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex gap-3 items-center">
          <ClipboardSignature className="h-4 w-4" />
          {club.name}
        </div>

        <div className="flex gap-3 items-center">
          <Calendar className="h-4 w-4" />
          {new Date(game.date).toLocaleDateString("fr-FR", {
            dateStyle: "long",
          })}
        </div>

        <div className="flex gap-3 items-center">
          <Clock className="h-4 w-4" />
          {new Date(game.date).toLocaleTimeString("fr-FR", {
            timeStyle: "short",
          })}
        </div>

        <div className="flex gap-3 items-center">
          <MapPin className="h-4 w-4 flex-none" />
          {game.location}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 justify-end">
        <AddToCalendarButton
          name={`${club.name} - Match du ${new Date(
            game.date
          ).toLocaleDateString("fr-FR", {
            dateStyle: "long",
          })}`}
          options={["Google", "Yahoo", "iCal"]}
          location={game.location}
          startDate={new Date(game.date).toISOString().slice(0, 10)}
          endDate={new Date(game.date).toISOString().slice(0, 10)}
          startTime={new Date(game.date).toLocaleTimeString("fr-FR", {
            timeStyle: "short",
          })}
          endTime={new Date(endTimestamp).toLocaleTimeString("fr-FR", {
            timeStyle: "short",
          })}
          timeZone="Europe/Paris"
        />
        <Link
          to={`/game/${game.id}/edit`}
          className={buttonVariants({ variant: "secondary" })}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Modifier
        </Link>
      </CardFooter>
    </Card>
  );
}
