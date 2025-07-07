import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useUpdateSeason from "@/lib/season/useUpdateSeason";
import { useForm } from "react-hook-form";
import { Tables, TablesUpdate } from "shared/types/supabase";

type FormValues = TablesUpdate<"season">;

export default function UpdateSeasonDialog({
  season,
}: {
  season: Tables<"season">;
}) {
  const { mutate } = useUpdateSeason();
  const { register, handleSubmit } = useForm<FormValues>();

  function onSubmit(data: FormValues) {
    mutate({ id: season.id, name: data.name });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Modifier</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier une saison</DialogTitle>
        </DialogHeader>
        <form id="update-season" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            {...register("name")}
            required
            placeholder="Nom de la saison"
            defaultValue={season.name}
          />
        </form>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button type="submit" form="update-season">
              Enregistrer
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
