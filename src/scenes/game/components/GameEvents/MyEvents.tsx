import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import supabase from "@/utils/supabase";
import { useState } from "react";
import { Player } from "../../games.service";

export default function MyEvents({
  player,
  setPlayer,
}: {
  player: Player;
  setPlayer: (player: Player) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const goals = parseInt(form.get("goals") as string) || 0;
    const assists = parseInt(form.get("assists") as string) || 0;
    const saves = parseInt(form.get("saves") as string) || 0;

    setLoading(true);
    try {
      const { data } = await supabase
        .from("game_player")
        .update({
          goals,
          assists,
          saves,
        })
        .eq("id", player.id)
        .single()
        .throwOnError();

      if (data) setPlayer(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes actions</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          id="my-events"
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <div>
            <Label htmlFor="goals">Buts de gueudin</Label>
            <Input
              id="goals"
              name="goals"
              type="number"
              defaultValue={player.goals || 0}
            />
          </div>
          <div>
            <Label htmlFor="assists">Passes dé de l'espace</Label>
            <Input
              id="assists"
              name="assists"
              type="number"
              defaultValue={player.assists || 0}
            />
          </div>
          <div>
            <Label htmlFor="saves">Arrêts de star</Label>
            <Input
              id="saves"
              name="saves"
              type="number"
              defaultValue={player.saves || 0}
            />
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <Button type="submit" disabled={loading} form="my-events">
          {loading ? "En cours..." : "Enregistrer"}
        </Button>
      </CardFooter>
    </Card>
  );
}
