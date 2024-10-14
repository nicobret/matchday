import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarEvent, google, ics, outlook, yahoo } from "calendar-link";
import { Calendar } from "lucide-react";

export default function AddToCalendar({
  event,
  disabled,
}: {
  event: CalendarEvent;
  disabled: boolean;
}) {
  const googleUrl = google(event);
  const outlookUrl = outlook(event);
  const yahooUrl = yahoo(event);
  const icsUrl = ics(event);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled} variant="secondary">
          <Calendar className="mr-2 inline-block h-5 w-5" />
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
