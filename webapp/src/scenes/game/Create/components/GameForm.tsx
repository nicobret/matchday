import { Button } from "@/components/ui/button";
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
import useAuth from "@/lib/auth/useAuth";
import useClub from "@/lib/club/useClub";
import useCreateGame from "@/lib/game/useCreateGame";
import { useMembers } from "@/lib/member/useMembers";
import { fromZonedTime } from "date-fns-tz";
import { Controller, useForm } from "react-hook-form";
import type { TablesInsert } from "shared/types/supabase";
import { Link, useLocation } from "wouter";

type Payload = TablesInsert<"games">;
type FormValues = {
  date: string;
  time: string;
  total_players: number;
  location: string;
  status: string;
  duration: number;
  category: string;
  season_id?: string;
};

export default function GameForm({ clubId }: { clubId: number }) {
  const { data: club, isPending, isError } = useClub(clubId);
  const { isMember } = useMembers(clubId);
  const [_location, navigate] = useLocation();
  const { mutate, isPending: isCreationPending } = useCreateGame();
  const { register, handleSubmit, control } = useForm<FormValues>();
  const { session } = useAuth();
  const { toast } = useToast();

  if (!session?.user) {
    return <p className="text-center">Vous devez être connecté</p>;
  }
  if (isPending) {
    return <p className="text-center">Chargement des données...</p>;
  }
  if (isError) {
    return <p className="text-center">Une erreur s'est produite</p>;
  }
  if (!isMember) {
    return (
      <p className="text-center">Vous n&apos;êtes pas membre de ce club</p>
    );
  }

  const seasons = club.seasons || [];
  const seasonOptions = [
    ...seasons
      .sort((a, b) => b.name.localeCompare(a.name))
      .map((season) => ({ label: season.name, value: season.id })),
    { label: "Hors saison", value: "none" },
  ];

  function onSubmit(data: FormValues) {
    if (!session?.user || !club) return;

    const formattedDate = fromZonedTime(
      `${data.date}T${data.time}`,
      "Europe/Paris",
    ).toISOString();

    const payload: Payload = {
      date: formattedDate,
      total_players: data.total_players,
      location: data.location,
      status: "published",
      duration: data.duration * 60,
      category: data.category || "",
      season_id: data.season_id,
      club_id: club.id,
      creator_id: session?.user.id,
    };

    mutate(payload, {
      onSuccess: (game) => {
        toast({ description: "Match créé avec succès" });
        navigate(`~/game/${game?.id}`);
      },
    });
  }

  return (
    <form
      id="game-creator"
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-x-4 gap-y-6"
    >
      <div className="col-span-2 grid w-full items-center gap-2">
        <Label htmlFor="club">Club</Label>
        <Input type="text" id="club" value={club?.name || ""} disabled={true} />
      </div>

      <div className="col-span-2 grid w-full items-center gap-2">
        <Label htmlFor="season" className="flex justify-between">
          Saison
          <Link
            to={`~/club/${club.id}/edit#seasons`}
            className="text-primary text-sm"
          >
            Ajouter une saison
          </Link>
        </Label>
        <Controller
          name="season_id"
          control={control}
          defaultValue={seasonOptions[0].value}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {seasonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="playerCount">Nombre de joueurs</Label>
        <Input
          type="number"
          {...register("total_players", { required: true, min: 0 })}
          defaultValue={10}
        />
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="duration">Durée en minutes</Label>
        <Input
          type="number"
          {...register("duration", { required: true, min: 0 })}
          defaultValue={60}
        />
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="date">Date</Label>
        <Input type="date" {...register("date", { required: true })} />
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="time">Heure</Label>
        <Input type="time" {...register("time", { required: true })} />
      </div>

      <div className="col-span-2 grid w-full items-center gap-2">
        <Label htmlFor="location">Adresse</Label>
        <Textarea
          {...register("location", { required: true })}
          defaultValue={club.address || undefined}
          className="text-base"
        />
      </div>

      <Button type="submit" disabled={isCreationPending}>
        Créer
      </Button>

      <Button type="button" asChild variant="secondary">
        <Link to={`~/club/${club.id}`}>Annuler</Link>
      </Button>
    </form>
  );
}
