import supabaseClient from "../../../utils/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LeagueCard(league: {
  id: number;
  name: string;
  league_memberships: Array<{ user_id: string }>;
}) {
  async function join(leagueId: number) {
    const { data, error } = await supabaseClient
      .from("league_memberships")
      .insert({ league_id: leagueId })
      .select();
    if (error) {
      console.error(error);
    }
    console.log("🚀 ~ file: List.tsx:22 ~ join ~ data", data);
  }

  async function leave(leagueId: number) {
    if (window.confirm("Voulez-vous vraiment quitter cette ligue ?")) {
      const { data, error } = await supabaseClient
        .from("league_memberships")
        .delete()
        .eq("league_id", leagueId)
        .select();
      if (error) {
        console.error(error);
      }
      console.log("🚀 ~ file: List.tsx:22 ~ join ~ data", data);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{league.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {league.league_memberships.length} membres
        </CardDescription>
      </CardContent>
      <CardFooter>
        <button onClick={() => join(league.id)}>Rejoindre</button>
        <button onClick={() => leave(league.id)}>Quitter</button>
      </CardFooter>
    </Card>
  );
}
