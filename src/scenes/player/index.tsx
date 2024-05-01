import Breadcrumbs from "@/components/Breadcrumbs";
import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tables } from "types/supabase";

export default function Player() {
  const { id } = useParams();
  console.log("🚀 ~ Player ~ id:", id);
  const [player, setPlayer] = useState<Tables<"users"> | null>(null);
  console.log("🚀 ~ Player ~ player:", player);
  const [loading, setLoading] = useState(false);

  async function getPlayer(id: string) {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("users")
        .select()
        .eq("id", id)
        .single()
        .throwOnError();
      if (data) {
        setPlayer(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPlayer(id);
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
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-6 first:mt-0">
        Clubs
      </h2>
    </div>
  );
}
