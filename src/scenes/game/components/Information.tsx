import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import { Calendar, Clock, Hourglass, List, MapPin, Shield } from "lucide-react";
import { Game, getGameDurationInMinutes } from "../games.service";

export default function Information({ game }: { game: Game }) {
  const endTimestamp = new Date(game.date).getTime() + 2 * 60 * 60 * 1000;
  return (
    <Card className="col-span-2 md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">Informations</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-1">
        <p>
          <Calendar className="mr-2 inline-block h-4 w-4 align-text-top" />
          {new Date(game.date).toLocaleDateString("fr-FR", {
            dateStyle: "long",
          })}
        </p>

        <p>
          <Clock className="mr-2 inline-block h-4 w-4 align-text-top" />
          {new Date(game.date).toLocaleTimeString("fr-FR", {
            timeStyle: "short",
          })}
        </p>

        <p>
          <Hourglass className="mr-2 inline-block h-4 w-4 align-text-top" />
          {getGameDurationInMinutes(game.duration as string)} minutes
        </p>

        <p className="capitalize">
          <List className="mr-2 inline-block h-4 w-4 align-text-top" />
          {game.category}
        </p>

        <p className="col-span-2">
          <Shield className="mr-2 inline-block h-4 w-4 align-text-top" />
          {game.club?.name}
        </p>

        <p className="col-span-2">
          <MapPin className="mr-2 inline-block h-4 w-4 align-text-top" />
          {game.location}
        </p>
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
          label="Ajouter au calendrier"
          lightMode="bodyScheme"
        />
      </CardFooter>
    </Card>
  );
}
