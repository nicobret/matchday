import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import supabase from "@/utils/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tables } from "types/supabase";

async function fetchGame(id: string) {
  const { data } = await supabase
    .from("games")
    .select("*, club: clubs!games_club_id_fkey(*)")
    .eq("id", parseInt(id))
    .single()
    .throwOnError();
  return data;
}

export default function EditGame() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [club, setClub] = useState<Tables<"clubs">>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    duration: 60,
    location: "",
    score: [],
    status: "",
    total_players: 0,
  });

  async function updateGame() {
    try {
      setLoading(true);
      await supabase.from("games").update(formData).eq("id", id).throwOnError();
      navigate(`/game/${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchGame(id)
        .then((data) => {
          if (data) {
            setFormData({
              date: new Date(data.date).toISOString().split("T")[0],
              duration: data.duration as number,
              location: data.location,
              score: data.score,
              status: data.status,
              total_players: data.total_players,
            });
            setClub(data.club);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Breadcrumbs
        links={[
          { label: club?.name, link: `/club/${club?.id}` },
          { label: "Edit Game", link: `/game/${id}/edit` },
        ]}
      />
      <h1 className="mt-6 scroll-m-20 text-3xl font-bold tracking-tight">
        Edit Game
      </h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await updateGame();
        }}
        className="mt-6"
      >
        <Label htmlFor="date">Date</Label>
        <Input
          name="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <Label htmlFor="duration">Durée</Label>
        <Input
          name="duration"
          type="number"
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: parseInt(e.target.value) })
          }
        />
        <Label htmlFor="location">Adresse</Label>
        <Input
          name="location"
          type="text"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />
        <Label htmlFor="status">Statut</Label>
        <Input
          name="status"
          type="text"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        />
        <Label htmlFor="total_players">Nombre de joueurs</Label>
        <Input
          name="total_players"
          type="number"
          value={formData.total_players}
          onChange={(e) =>
            setFormData({
              ...formData,
              total_players: parseInt(e.target.value),
            })
          }
        />
        <Label htmlFor="score">Score</Label>
        <Input
          name="score"
          type="text"
          value={formData.score}
          onChange={(e) =>
            setFormData({ ...formData, score: e.target.value.split(",") })
          }
        />
        <Link
          to={`/game/${id}`}
          className={buttonVariants({ variant: "secondary" })}
        >
          Retour
        </Link>
        <Button type="submit">Enregistrer</Button>
      </form>
    </div>
  );
}
