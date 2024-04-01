import { gamePlayer } from "../View";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import LineupEditor from "./LineupEditor";

export default function LineUp({
  players,
  setPlayers,
  disabled,
}: {
  players: gamePlayer[];
  setPlayers: React.Dispatch<React.SetStateAction<gamePlayer[]>>;
  disabled: boolean;
}) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex gap-3 items-center">
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
