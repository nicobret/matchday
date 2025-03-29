import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { google, ics, outlook, yahoo } from "calendar-link";
import { Calendar } from "lucide-react";
import { Game, getCalendarEvent } from "../lib/game/game.service";

export default function AddToCalendar({ game }: { game: Game }) {
  const event = getCalendarEvent(game);
  const googleUrl = google(event);
  const outlookUrl = outlook(event);
  const yahooUrl = yahoo(event);
  const icsUrl = ics(event);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Calendar />
          Ajouter au calendrier
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem asChild className="p-4">
          <a href={googleUrl} target="_blank" className="flex gap-2">
            Google
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="p-4">
          <a href={outlookUrl} target="_blank" className="flex gap-2">
            Outlook
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="p-4">
          <a href={yahooUrl} target="_blank" className="flex gap-2">
            Yahoo
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="p-4">
          <a href={icsUrl} target="_blank" className="flex gap-2">
            iCal
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
