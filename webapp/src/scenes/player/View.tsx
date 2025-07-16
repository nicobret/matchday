import useProfile from "@/lib/profile/useProfile";
import { fetchPlayerStats } from "@/lib/statistics/statsService";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, TrafficCone } from "lucide-react";
import { Link, useParams } from "wouter";

export default function View() {
  const params = new URLSearchParams(window.location.search);
  const fromClub = params.get("fromClub");
  const { id } = useParams();
  const { data: player, isPending } = useProfile(id);
  const { data: stats, isPending: isStatsPending } = useQuery({
    queryFn: () => fetchPlayerStats(id!),
    queryKey: ["playerStats", id],
    enabled: !!id,
  });

  if (isPending || isStatsPending) {
    return <div>Loading...</div>;
  }
  if (!player) {
    return <div>Player not found</div>;
  }
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

      <p className="mt-2">
        <TrafficCone className="mr-2 inline-block h-4 w-4" />
        Page en chantier.
      </p>

      {/* 
            <br />
            <h2>Mes dernières performances</h2>
            <br />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Match ID</TableHead>
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
          {stats?.map((stat) => (
            <TableRow key={stat.game_id}>
              <TableCell>{stat.game_id || "Aucune donnée"}</TableCell>
              <TableCell>
                {stats?.length
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
      </Table> */}
    </div>
  );
}
