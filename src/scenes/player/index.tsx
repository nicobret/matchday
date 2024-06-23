import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tables } from "types/supabase";
import { fetchPlayer } from "./player.service";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function Player() {
  const { id } = useParams();
  const [player, setPlayer] = useState<Tables<"users"> | null>(null);
  const [loading, setLoading] = useState(false);

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
      <Breadcrumbs links={[{ label: "Player", link: `/player/${id}` }]} />
      <h1 className="mt-6 scroll-m-20 text-2xl font-bold tracking-tight lg:text-5xl">
        {player.firstname} {player.lastname}
      </h1>
      <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Clubs
      </h2>
    </div>
  );
}
