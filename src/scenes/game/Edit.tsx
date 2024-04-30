import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "@/utils/supabase";

export default function EditGame() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    duration: null,
    location: "",
    score: [],
    status: "",
    total_players: 0,
  });

  async function getGame(id: string) {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("games")
        .select()
        .eq("id", parseInt(id))
        .single()
        .throwOnError();

      if (data) {
        setFormData({
          date: data.date,
          duration: data.duration,
          location: data.location,
          score: data.score,
          status: data.status,
          total_players: data.total_players,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateGame() {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("games")
        .update(formData)
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) {
      console.error("No id provided");
      return;
    }
    getGame(id);
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Game</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await updateGame();
        }}
      >
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <input
          type="number"
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: parseInt(e.target.value) })
          }
        />
        <input
          type="text"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />
        <input
          type="text"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        />
        <input
          type="number"
          value={formData.total_players}
          onChange={(e) =>
            setFormData({
              ...formData,
              total_players: parseInt(e.target.value),
            })
          }
        />
        <input
          type="text"
          value={formData.score}
          onChange={(e) =>
            setFormData({ ...formData, score: e.target.value.split(",") })
          }
        />
        <button onClick={() => navigate("/")}>Cancel</button>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
