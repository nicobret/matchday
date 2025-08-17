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
import { Link, useParams } from "wouter";
import PlayerStatsChart from "./components/PlayerStatsChart";

export default function View() {
  const params = new URLSearchParams(window.location.search);
  const fromClub = params.get("fromClub");
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

  return (
    <div className="mx-auto max-w-4xl p-4">
      {fromClub ? (
        <Link
          to={`/club/${fromClub}`}
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

      <h1 className="mt-6 scroll-m-20 text-2xl font-bold tracking-tight lg:text-5xl">
        {player.firstname} {player.lastname}
      </h1>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Résumé par clubs
      </h2>

      {formattedData.map((clubAggregation) => (
        <div key={clubAggregation.clubId}>
          <h3 className="mt-4 text-2xl font-semibold">
            {clubAggregation.clubName}
          </h3>
          <PlayerStatsChart data={clubAggregation.statsBySeason} />
        </div>
      ))}

      <br />
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Mes dernières performances
      </h2>
      <br />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Club</TableHead>
            <TableHead>Saison</TableHead>
            <TableHead>Équipe</TableHead>
            <TableHead>Buts</TableHead>
            <TableHead>Passes décisives</TableHead>
            <TableHead>Arrêts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history?.map((stat) => (
            <TableRow key={stat.game_id}>
              <TableCell>
                {history?.length
                  ? new Date(stat.game_date || "").toLocaleDateString("fr-FR")
                  : "Aucune donnée"}
              </TableCell>
              <TableCell>{stat.club_name || "Aucune donnée"}</TableCell>
              <TableCell>{stat.season_name}</TableCell>
              <TableCell>{stat.user_team}</TableCell>
              <TableCell>{stat.goals}</TableCell>
              <TableCell>{stat.assists}</TableCell>
              <TableCell>{stat.saves}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
