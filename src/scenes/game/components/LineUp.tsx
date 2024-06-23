import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import LineupEditor from "./LineupEditor";
import { Player } from "../games.service";

export default function LineUp({
  players,
  setPlayers,
  disabled,
}: {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  disabled: boolean;
}) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <ClipboardList className="h-5 w-5" />
          Compositions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {disabled ? (
          <div className="text-center">
            <p>La composition ne peut pas être modifiée.</p>
          </div>
        ) : (
          <LineupEditor players={players} setPlayers={setPlayers} />
        )}
      </CardContent>
    </Card>
  );
}
