import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";
import { Game } from "../games.service";

export default function Statistics({ game }: { game: Game }) {
  const [stats, setStats] = useState<any[]>([]);
  const [sortby, setSortby] = useState("goals");
  const sortedStats = stats.sort((a, b) => b[sortby] - a[sortby]);

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
        <Label>Trier par</Label>
        <Select
          name="sortby"
          value={sortby}
          onValueChange={(value) => setSortby(value)}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="goals">Buts</SelectItem>
            <SelectItem value="assists">Passes décisives</SelectItem>
            <SelectItem value="saves">Arrêts</SelectItem>
          </SelectContent>
        </Select>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prénom</TableHead>
              <TableHead>Equipe</TableHead>
              <TableHead>Buts</TableHead>
              <TableHead>Passes décisives</TableHead>
              <TableHead>Arrêts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStats.map((row) => {
              return (
                <TableRow key={row.id}>
                  <TableCell>{row.firstname}</TableCell>
                  <TableCell>
                    {row.team === 0 ? "Domicile" : "Extérieur"}
                  </TableCell>
                  <TableCell>{row.goals}</TableCell>
                  <TableCell>{row.assists}</TableCell>
                  <TableCell>{row.saves}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter></CardFooter>
    </Card>
  );
}
