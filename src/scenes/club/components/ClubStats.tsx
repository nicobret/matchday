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
    <section id="stats" className="mb-8">
      <h2 className="mt-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Statistiques
      </h2>
      <div className="mb-2 mt-4 flex gap-2">
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
              <SelectItem value="winstreak">Série de victoires</SelectItem>
              <SelectItem value="goals">Buts</SelectItem>
              <SelectItem value="assists">Passes décisives</SelectItem>
              <SelectItem value="saves">Arrêts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Prénom</TableHead>
            <TableHead>Matchs</TableHead>
            <TableHead>Victoires</TableHead>
            <TableHead>Série de victoires</TableHead>
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
                  <TableCell>{row.winstreak}</TableCell>
                  <TableCell>{row.goals}</TableCell>
                  <TableCell>{row.assists}</TableCell>
                  <TableCell>{row.saves}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </section>
  );
}
