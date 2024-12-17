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
import { Crown } from "lucide-react";
import { useState } from "react";
import useClubStats, { ClubStatsType } from "../lib/useClubStats";

export default function ClubStats({ clubId }: { clubId: number }) {
  const { data, isError, isLoading, isIdle } = useClubStats(clubId);

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
    <div className="mt-4 grid gap-8 md:grid-cols-2">
      <Wins data={data} />
      <Events data={data} />
    </div>
  );
}

function Wins({ data }: { data: ClubStatsType[] }) {
  const [sortBy, setSortBy] = useState<"games" | "wins" | "winstreak">("wins");

  return (
    <div className="overflow-x-auto">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Victoires
      </h3>
      <div className="mb-2 mt-4 flex gap-2">
        <div className="grid w-full max-w-36 items-center gap-1.5">
          <Label>Trier par</Label>
          <Select
            name="sortby"
            value={sortBy}
            onValueChange={(value: "games" | "wins" | "winstreak") =>
              setSortBy(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="games">Matchs</SelectItem>
              <SelectItem value="wins">Victoires</SelectItem>
              <SelectItem value="winstreak">Série de victoires</SelectItem>
              <SelectItem value="winrate">Pourcentage de victoires</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableRow></TableRow>
            <TableHead>Prénom</TableHead>
            <TableHead>Matchs</TableHead>
            <TableHead>Victoires</TableHead>
            <TableHead>Série</TableHead>
            <TableHead>Pourcentage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data
            .sort((a, b) => b[sortBy] - a[sortBy])
            .map((row, index) => {
              return (
                <TableRow key={row.user_id}>
                  <TableCell className="text-center">
                    {index + 1 === 1 ? (
                      <Crown className="inline-block text-primary" />
                    ) : (
                      <span className="text-muted-foreground">{index + 1}</span>
                    )}
                  </TableCell>
                  <TableCell>{row.firstname}</TableCell>
                  <TableCell>{row.games}</TableCell>
                  <TableCell>{row.wins}</TableCell>
                  <TableCell>{row.winstreak}</TableCell>
                  <TableCell>{row.winrate} %</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}

function Events({ data }: { data: ClubStatsType[] }) {
  const [sortby, setSortby] = useState<"games" | "goals" | "assists" | "saves">(
    "goals",
  );

  return (
    <div className="overflow-x-auto">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Actions
      </h3>
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
            <TableRow></TableRow>
            <TableHead>Prénom</TableHead>
            <TableHead>Buts</TableHead>
            <TableHead>Passes décisives</TableHead>
            <TableHead>Arrêts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data
            .sort((a, b) => b[sortby] - a[sortby])
            .map((row, index) => {
              return (
                <TableRow key={row.user_id}>
                  <TableCell className="text-center">
                    {index + 1 === 1 ? (
                      <Crown className="inline-block text-primary" />
                    ) : (
                      <span className="text-muted-foreground">{index + 1}</span>
                    )}
                  </TableCell>
                  <TableCell>{row.firstname}</TableCell>
                  <TableCell>{row.goals}</TableCell>
                  <TableCell>{row.assists}</TableCell>
                  <TableCell>{row.saves}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
