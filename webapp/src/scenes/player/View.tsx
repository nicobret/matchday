import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import useProfile from "@/lib/profile/useProfile";
import { getPlayerStatsByUserId } from "@/lib/statistics/statsService";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Link, useParams } from "wouter";
import PlayerStatsChart from "./components/PlayerStatsChart";

export default function View() {
  const [fromClub] = useQueryState("fromClub", parseAsInteger);
  const { id } = useParams();
  const { data: player, isPending } = useProfile(id);
  const {
    data,
    isPending: isStatsPending,
    isError: isStatsError,
  } = useQuery({
    queryFn: () => getPlayerStatsByUserId(id!),
    queryKey: ["playerStats", id],
    enabled: !!id,
  });

  const defaultClubId = fromClub || data?.formattedData[0]?.clubId || 0;

  const [clubId, setClubId] = useQueryState(
    "club",
    parseAsInteger.withDefault(defaultClubId),
  );

  if (isPending || isStatsPending) {
    return <div>Loading...</div>;
  }
  if (isStatsError) {
    return <div>Error loading player stats</div>;
  }
  if (!player) {
    return <div>Player not found</div>;
  }
  const { history, formattedData } = data;

  const clubOptions = formattedData.map((club) => ({
    label: club.clubName,
    value: club.clubId,
  }));

  const clubData = formattedData.find((club) => club.clubId === clubId);
  const clubHistory = history?.filter((stat) => stat.club_id === clubId);

  return (
    <div className="mx-auto max-w-4xl p-2">
      {fromClub ? (
        <Link
          to={`~/club/${fromClub}`}
          className="text-muted-foreground text-sm"
        >
          <ArrowLeft className="mr-2 inline-block h-4 w-4 align-text-top" />
          Retour au club
        </Link>
      ) : (
        <Link to="~/" className="text-muted-foreground text-sm">
          <ArrowLeft className="mr-2 inline-block h-4 w-4 align-text-top" />
          Retour à l'accueil
        </Link>
      )}

      <div className="my-8 flex gap-4">
        <div className="flex-none">
          <div className="bg-muted h-16 w-16 rounded-full border-2 border-dashed"></div>
        </div>
        <div>
          <p className="font-new-amsterdam text-4xl">
            {player.firstname} {player.lastname}
          </p>
          <p>
            Inscrit depuis le {new Date(player.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="my-4 grid gap-2">
        <Label>Club</Label>
        <Select
          onValueChange={(value) => setClubId(parseInt(value, 10))}
          defaultValue={clubId.toString()}
        >
          <SelectTrigger className="w-fit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {clubOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {clubData && (
        <Card>
          <CardHeader>
            <CardTitle>Mes actions</CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerStatsChart data={clubData.statsBySeason} />
          </CardContent>
        </Card>
      )}

      <br />

      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Saison</TableHead>
                <TableHead>Équipe</TableHead>
                <TableHead>Buts</TableHead>
                <TableHead>Passes décisives</TableHead>
                <TableHead>Arrêts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubHistory?.map((stat) => (
                <TableRow key={stat.game_id}>
                  <TableCell>
                    {history?.length
                      ? new Date(stat.game_date || "").toLocaleDateString(
                          "fr-FR",
                        )
                      : "Aucune donnée"}
                  </TableCell>
                  <TableCell>{stat.season_name}</TableCell>
                  <TableCell>{stat.user_team}</TableCell>
                  <TableCell>{stat.goals}</TableCell>
                  <TableCell>{stat.assists}</TableCell>
                  <TableCell>{stat.saves}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
