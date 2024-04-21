import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabaseClient from "@/utils/supabase";
import { Tables } from "types/supabase";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowRight, History as HistoryPicto } from "lucide-react";

export default function ClubHistory({ clubId }: { clubId: number }) {
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<Tables<"games">[]>();
  const [year, setYear] = useState("2024");

  useEffect(() => {
    async function getGames() {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from("games")
        .select("*")
        .eq("club_id", clubId)
        .gte("date", new Date(parseInt(year), 0, 1).toISOString())
        .lte("date", new Date(parseInt(year), 11, 31).toISOString())
        .lte("date", new Date().toISOString())
        .order("date", { ascending: false });
      if (error) {
        console.error(error);
      }
      setGames(data);
      setLoading(false);
    }
    getGames();
  }, [clubId, year]);

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <HistoryPicto className="h-5 w-5" />
              Historique
            </div>

            <div>
              <Select onValueChange={setYear} defaultValue={year}>
                <SelectTrigger className="w-[180px">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-auto">
        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : games?.length ? (
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>
                    {new Date(game.date).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    {game.score && game.score.length === 2
                      ? game.score[0].toString() +
                        " - " +
                        game.score[1].toString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/games/${game.id}`}
                      className={
                        buttonVariants({ variant: "secondary" }) + "gap-2"
                      }
                    >
                      Voir
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center">Aucun match joué.</p>
        )}
      </CardContent>
    </Card>
  );
}
