import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Game, getGameDurationInMinutes } from "@/lib/game/gameService";
import useGame from "@/lib/game/useGame";
import useUpdateGame from "@/lib/game/useUpdateGame";
import useSeasons from "@/lib/season/useSeasons";
import { fromZonedTime } from "date-fns-tz";
import { useForm } from "react-hook-form";
import { TablesUpdate } from "shared/types/supabase";
import { Link, useLocation, useParams } from "wouter";

type FormValues = {
  date: string;
  time: string;
  total_players: number;
  location: string;
  durationInMinutes: number;
  category: string;
  season_id?: string;
};

export default function EditGame() {
  const { id } = useParams();
  const { data, isPending, isError } = useGame(Number(id));

  if (isPending) {
    return <div>Chargement...</div>;
  }
  if (isError) {
    return <div>Erreur</div>;
  }
  return <Editor game={data} />;
}

function getFormValuesFromData(game: Game) {
  return {
    date: game.date.split("T")[0] || "",
    time: new Date(game.date).toLocaleTimeString("fr-FR", {
      timeStyle: "short",
    }),
    durationInMinutes: getGameDurationInMinutes(
      (game.duration as string) || "00:60:00",
    ),
    location: game.location || "",
    total_players: game.total_players || 10,
    category: game.category || "futsal",
    season_id: game.season_id || undefined,
  };
}

function getPayloadFromFormValues(data: FormValues): TablesUpdate<"games"> {
  return {
    date: fromZonedTime(
      `${data.date}T${data.time}`,
      "Europe/Paris",
    ).toISOString(),
    duration: data.durationInMinutes * 60,
    location: data.location,
    total_players: data.total_players,
    category: data.category,
    season_id: data.season_id?.toString(),
  };
}

function Editor({ game }: { game: Game }) {
  const [_location, navigate] = useLocation();
  const { data: seasons } = useSeasons(game.club_id);
  const initialValues = getFormValuesFromData(game);
  const { mutate, isPending } = useUpdateGame(game.id);
  const { toast } = useToast();
  const { register, handleSubmit, setValue } = useForm<FormValues>();

  function onSubmit(data: FormValues) {
    const payload = getPayloadFromFormValues(data);
    mutate(payload, {
      onSuccess: () => {
        toast({ description: "Match mis à jour" });
        navigate(`~/game/${game.id}`);
      },
    });
  }

  function handleDelete() {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce match ?")) {
      mutate(
        { status: "deleted" },
        { onSuccess: () => navigate(`~/club/${game.club_id}`) },
      );
    }
  }

  return (
    <div className="mx-auto max-w-lg p-4">
      <h2 className="font-new-amsterdam mb-2 mt-6 scroll-m-20 text-center text-4xl">
        Modifier un match
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-muted/30 mx-auto mt-8 grid max-w-lg grid-cols-2 gap-4 rounded-lg border p-4"
      >
        <div className="col-span-2 grid w-full items-center gap-2">
          <Label htmlFor="season">Saison</Label>
          <Select
            onValueChange={(value) => setValue("season_id", value)}
            defaultValue={initialValues.season_id}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir une saison" />
            </SelectTrigger>
            <SelectContent>
              {seasons?.map((season) => (
                <SelectItem key={season.id} value={season.id}>
                  {season.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="total_players">Nombre de joueurs</Label>
          <Input
            type="number"
            {...register("total_players")}
            defaultValue={initialValues.total_players}
          />
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="duration">Durée en minutes</Label>
          <Input
            type="number"
            {...register("durationInMinutes")}
            defaultValue={initialValues.durationInMinutes}
          />
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            {...register("date")}
            defaultValue={initialValues.date}
            required
          />
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="time">Heure</Label>
          <Input
            type="time"
            {...register("time")}
            defaultValue={initialValues.time}
            required
          />
        </div>

        <div className="col-span-2 grid w-full items-center gap-2">
          <Label htmlFor="location" className="">
            Adresse
          </Label>
          <Textarea
            {...register("location")}
            defaultValue={initialValues.location}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="col-span-2 w-full"
        >
          Enregistrer
        </Button>

        <Link
          to={`~/game/${game.id}`}
          className={buttonVariants({ variant: "secondary" })}
        >
          Annuler
        </Link>

        <Button onClick={handleDelete} variant="destructive">
          Supprimer le match
        </Button>
      </form>
    </div>
  );
}
