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
import { Game, GameEvent } from "../../games.service";

const eventTypes = [
  { label: "But de gueudin", value: "goal" },
  { label: "Passe dé de l'espace", value: "assist" },
  { label: "Arrêt de star", value: "save" },
];

export default function MyEvents({
  gameEvents,
  game,
}: {
  gameEvents: GameEvent[];
  game: Game;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();

      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Vous n'êtes pas connecté");
      }

      console.log("🚀 ~ handleSubmit ~ e.target:", e.target);
      const form = new FormData(e.target);

      const goals = parseInt(form.get("goals") as string) || 0;
      const assists = form.get("assists") || 0;
      const saves = form.get("saves") || 0;

      // upsert goals
      const { data, error } = await supabase.from("game_event").upsert({
        type: "goal",
        count: goals,
        game_id: game.id,
        user_id: user.id,
      });
      if (error) {
        throw error;
      }

      console.log("🚀 ~ handleSubmit ~ data", data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes actions de fou</CardTitle>
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
              defaultValue={
                gameEvents.find((e) => e.type === "goal")?.count || 0
              }
            />
          </div>
          <div>
            <Label htmlFor="assists">Passes dé de l'espace</Label>
            <Input
              id="assists"
              name="assists"
              type="number"
              defaultValue={
                gameEvents.find((e) => e.type === "assist")?.count || 0
              }
            />
          </div>
          <div>
            <Label htmlFor="saves">Arrêts de star</Label>
            <Input
              id="saves"
              name="saves"
              type="number"
              defaultValue={
                gameEvents.find((e) => e.type === "save")?.count || 0
              }
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
