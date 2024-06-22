import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import supabase from "@/utils/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Game, fetchGame } from "./games.service";

export default function EditGame() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<Game>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      return navigate("/");
    }
    fetchGame(parseInt(id))
      .then((data) => {
        if (data) setGame(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!game) {
    return <div>Game not found</div>;
  }

  return <Editor game={game} loading={loading} setLoading={setLoading} />;
}

function Editor({
  game,
  loading,
  setLoading,
}: {
  game: Game;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) {
  const [data, setData] = useState({
    date: game.date,
    duration: game.duration as number,
    location: game.location || "",
    score: game.score || [0, 0],
    status: game.status,
    total_players: game.total_players || 10,
  });
  const navigate = useNavigate();

  async function updateGame() {
    setLoading(true);
    try {
      await supabase
        .from("games")
        .update(data)
        .eq("id", game.id)
        .throwOnError();
      setLoading(false);
      navigate(`/game/${game.id}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <Breadcrumbs
        links={[
          { label: game.club?.name || "", link: `/club/${game.club?.id}` },
          { label: "Edit Game", link: `/game/${game.id}/edit` },
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
          value={data.date}
          onChange={(e) => setData({ ...data, date: e.target.value })}
        />
        <Label htmlFor="duration">Durée</Label>
        <Input
          name="duration"
          type="number"
          value={data.duration}
          onChange={(e) =>
            setData({ ...data, duration: parseInt(e.target.value) })
          }
        />
        <Label htmlFor="location">Adresse</Label>
        <Input
          name="location"
          type="text"
          value={data.location}
          onChange={(e) => setData({ ...data, location: e.target.value })}
        />
        <Label htmlFor="status">Statut</Label>
        <Input
          name="status"
          type="text"
          value={data.status}
          onChange={(e) => setData({ ...data, status: e.target.value })}
        />
        <Label htmlFor="total_players">Nombre de joueurs</Label>
        <Input
          name="total_players"
          type="number"
          value={data.total_players}
          onChange={(e) =>
            setData({
              ...data,
              total_players: parseInt(e.target.value),
            })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="score_home">Score home</Label>
            <Input
              name="score_home"
              type="text"
              value={data.score[0]}
              onChange={(e) =>
                setData({
                  ...data,
                  score: [parseInt(e.target.value), data.score[1]],
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="score_away">Score visiteurs</Label>
            <Input
              name="score_away"
              type="text"
              value={data.score[1]}
              onChange={(e) =>
                setData({
                  ...data,
                  score: [data.score[0], parseInt(e.target.value)],
                })
              }
            />
          </div>
        </div>

        <Link
          to={`/game/${game.id}`}
          className={buttonVariants({ variant: "secondary" })}
        >
          Retour
        </Link>

        <Button type="submit" disabled={loading}>
          Enregistrer
        </Button>
      </form>
    </div>
  );
}
