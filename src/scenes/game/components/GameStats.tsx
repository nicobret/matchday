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
import { useState } from "react";
import useGameStats from "../lib/game/useGameStats";

export default function Statistics({ gameId }: { gameId: number }) {
  const [team, setTeam] = useState("all");
  const [sortby, setSortby] = useState<"goals" | "assists" | "saves">("goals");
  const { data, isError, isLoading, isIdle } = useGameStats({ gameId, sortby });

  if (isIdle) {
    return <div>Selectionnez un match</div>;
  }
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  if (isError) {
    return <div>Erreur</div>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Joueurs</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-2 flex gap-2">
          <div className="grid w-full max-w-36 items-center gap-1.5">
            <Label>Trier par</Label>
            <Select
              name="sortby"
              value={sortby}
              onValueChange={(value: "goals" | "assists" | "saves") =>
                setSortby(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="goals">Buts</SelectItem>
                <SelectItem value="assists">Passes décisives</SelectItem>
                <SelectItem value="saves">Arrêts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full max-w-36 items-center gap-1.5">
            <Label>Equipe</Label>
            <Select
              name="team"
              value={team}
              onValueChange={(value: "home" | "away" | "all") => setTeam(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="home">Domicile</SelectItem>
                <SelectItem value="away">Extérieur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
            {data
              .filter((row) => !!row.user_id)
              .filter((row) => (team === "all" ? true : row.user_team === team))
              .map((row) => {
                return (
                  <TableRow key={row.user_id}>
                    <TableCell>{row.firstname}</TableCell>
                    <TableCell>{row.user_team}</TableCell>
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
