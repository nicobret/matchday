import { ArrowLeft, TrafficCone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Tables } from "types/supabase";
import { fetchPlayer } from "./player.service";

export default function Player() {
  const { id } = useParams();
  const [player, setPlayer] = useState<Tables<"users"> | null>(null);
  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const fromClub = params.get("fromClub");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchPlayer(id)
      .then((data) => setPlayer(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

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
          className="text-sm text-muted-foreground"
        >
          <ArrowLeft className="mr-2 inline-block h-4 w-4 align-text-top" />
          Retour au club
        </Link>
      ) : (
        <Link to="/" className="text-sm text-muted-foreground">
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
