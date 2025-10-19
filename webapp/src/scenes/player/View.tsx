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
import useSeasons from "@/lib/season/useSeasons";
import { getPlayerStatsByUserId } from "@/lib/statistics/statsService";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import type { Tables } from "shared/types/supabase";
import { Link, useParams } from "wouter";
import PlayerStatsChart from "./components/PlayerStatsChart";

export default function View() {
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

  const defaultClubId = data?.formattedData[0]?.clubId || 0;

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
    <div className="mx-auto grid max-w-4xl gap-4 p-2">
      {clubId && (
        <Link to={`~/club/${clubId}`} className="text-muted-foreground text-sm">
          <ArrowLeft className="mr-2 inline-block h-4 w-4 align-text-top" />
          Retour au club
        </Link>
      )}

      <div className="flex items-center gap-4 py-4">
        <div className="flex-none">
          <div className="bg-muted h-16 w-16 rounded-full border-2 border-dashed"></div>
        </div>
        <div>
          <p className="font-new-amsterdam text-4xl">
            {player.firstname} {player.lastname}
          </p>
          <p className="text-muted-foreground text-sm">
            Inscrit depuis le {new Date(player.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid gap-2">
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
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerStatsChart data={clubData.statsBySeason} />
          </CardContent>
        </Card>
      )}

      {clubHistory && <HistoryCard clubId={clubId} history={clubHistory} />}
    </div>
  );
}

function HistoryCard({
  clubId,
  history,
}: {
  clubId: number;
  history: Tables<"game_report">[];
}) {
  const { data: seasons } = useSeasons(clubId);
  const options = seasons?.map((season) => ({
    label: season.name,
    value: season.id,
  }));
  const [seasonId, setSeasonId] = useQueryState("season", {
    defaultValue: "",
  });

  const filteredHistory = seasonId
    ? history.filter((stat) => stat.season_id === seasonId)
    : history;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Historique</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 grid gap-2">
          <Label>Saison</Label>
          <Select
            onValueChange={(value) => setSeasonId(value)}
            defaultValue={seasonId}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Toutes saisons" />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Équipe</TableHead>
                <TableHead>Buts</TableHead>
                <TableHead>Passes décisives</TableHead>
                <TableHead>Arrêts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory?.length
                ? filteredHistory.map((stat) => (
                    <TableRow key={stat.game_id}>
                      <TableCell>
                        {new Date(stat.game_date || "").toLocaleDateString(
                          "fr-FR",
                        )}
                      </TableCell>
                      <TableCell>{stat.user_team}</TableCell>
                      <TableCell>{stat.goals}</TableCell>
                      <TableCell>{stat.assists}</TableCell>
                      <TableCell>{stat.saves}</TableCell>
                    </TableRow>
                  ))
                : "Aucune donnée"}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
