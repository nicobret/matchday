import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";
import { Game } from "../games.service";

export default function Statistics({ game }: { game: Game }) {
  console.log("🚀 ~ Statistics ~ game:", game);
  const [stats, setStats] = useState<any[]>([]);
  console.log("🚀 ~ Statistics ~ stats:", stats);

  async function fetchStats(game_id: number) {
    const { data, error } = await supabase
      .from("game_report")
      .select()
      .eq("game_id", game_id);
    if (error) {
      console.error("Error fetching stats:", error.message);
    }
    if (data) setStats(data);
  }

  useEffect(() => {
    fetchStats(game.id);
  }, [game.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evénements</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {stats.map((row) => {
            return <li className="mt-2 list-disc">{JSON.stringify(row)}</li>;
          })}
        </ul>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
