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
  Hourglass,
  MapPin,
  Pencil,
} from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import { Game, getGameDurationInMinutes } from "../games.service";

export default function Information({ game }: { game: Game }) {
  const endTimestamp = new Date(game.date).getTime() + 2 * 60 * 60 * 1000;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">Informations</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center gap-3">
          <ClipboardSignature className="h-4 w-4" />
          {game.club?.name}
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4" />
          {new Date(game.date).toLocaleDateString("fr-FR", {
            dateStyle: "long",
          })}
          <Clock className="h-4 w-4" />
          {new Date(game.date).toLocaleTimeString("fr-FR", {
            timeStyle: "short",
          })}
        </div>

        <div className="flex items-center gap-3">
          <Hourglass className="h-4 w-4" />
          {getGameDurationInMinutes(game.duration as string)} minutes -{" "}
          {game.category}
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 flex-none" />
          {game.location}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <AddToCalendarButton
          name={`${game.club?.name} - Match du ${new Date(
            game.date,
          ).toLocaleDateString("fr-FR", {
            dateStyle: "long",
          })}`}
          options={["Google", "Yahoo", "iCal"]}
          location={
            game.location ||
            `${game.club?.address}, ${game.club?.city} ${game.club?.postcode}`
          }
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
          <Pencil className="mr-2 h-4 w-4" />
          Modifier
        </Link>
      </CardFooter>
    </Card>
  );
}
