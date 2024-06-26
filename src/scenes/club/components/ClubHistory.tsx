import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tables } from "types/supabase";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { fetchPastGames } from "../club.service";

export default function ClubHistory({ clubId }: { clubId: number }) {
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<Tables<"games">[]>();
  const [year, setYear] = useState("2024");

  useEffect(() => {
    setLoading(true);
    fetchPastGames(clubId, year)
      .then((data) => setGames(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [clubId, year]);

  if (loading) {
    return <p className="text-center">Chargement...</p>;
  }
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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

      <CardContent className="max-h-96 overflow-auto">
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
                      to={`/game/${game.id}`}
                      className={
                        buttonVariants({ variant: "secondary" }) + "gap-2"
                      }
                    >
                      Voir
                      <ArrowRight className="ml-2 h-5 w-5" />
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

      <CardFooter />
    </Card>
  );
}
