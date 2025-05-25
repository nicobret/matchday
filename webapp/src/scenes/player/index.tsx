import { ArrowLeft, TrafficCone } from "lucide-react";
import { Link, useParams } from "wouter";
import useProfile from "../home/useProfile";

export default function Player() {
  const { id } = useParams();
  const { data: player, isPending: loading } = useProfile(id);
  const params = new URLSearchParams(window.location.search);
  const fromClub = params.get("fromClub");

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!player) {
    return <div>Player not found</div>;
  }
  return (
    <div className="p-4">
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
    </div>
  );
}
