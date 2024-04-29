import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Player() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getPlayer(id: string) {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", parseInt(id))
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

  return (
    <div className="p-4">
      <h1>Player</h1>
      {player && (
        <div>
          <h2>{player.firstname}</h2>
          <p>{player.lastname}</p>
        </div>
      )}
    </div>
  );
}
