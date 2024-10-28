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
import useClubStats from "../lib/useClubStats";

export default function ClubStats({ clubId }: { clubId: number }) {
  const [sortby, setSortby] = useState<"games" | "goals" | "assists" | "saves">(
    "goals",
  );
  const { data, isError, isLoading, isIdle } = useClubStats({ clubId });

  if (isIdle) {
    return <div>Selectionnez un club</div>;
  }
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  if (isError) {
    return <div>Erreur</div>;
  }
  return (
    <Card id="stats">
      <CardHeader>
        <CardTitle>Statistiques</CardTitle>
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
                <SelectItem value="games">Matchs</SelectItem>
                <SelectItem value="wins">Victoires</SelectItem>
                <SelectItem value="goals">Buts</SelectItem>
                <SelectItem value="assists">Passes décisives</SelectItem>
                <SelectItem value="saves">Arrêts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prénom</TableHead>
              <TableHead>Matchs</TableHead>
              <TableHead>Victoires</TableHead>
              <TableHead>Buts</TableHead>
              <TableHead>Passes décisives</TableHead>
              <TableHead>Arrêts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              .sort((a, b) => b[sortby] - a[sortby])
              .map((row) => {
                return (
                  <TableRow key={row.user_id}>
                    <TableCell>{row.firstname}</TableCell>
                    <TableCell>{row.games}</TableCell>
                    <TableCell>{row.wins}</TableCell>
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
