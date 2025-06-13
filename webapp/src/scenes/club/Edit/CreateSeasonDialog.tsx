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
import { useForm } from "react-hook-form";
import { TablesInsert } from "shared/types/supabase";
import { useParams } from "wouter";
import useCreateSeason from "../lib/season/useCreateSeason";

type FormValues = TablesInsert<"season">;

export default function CreateSeasonDialog() {
  const { id } = useParams();
  const { mutate, isPending } = useCreateSeason(Number(id));
  const { register, handleSubmit } = useForm<FormValues>();

  function onSubmit(data: FormValues) {
    mutate(data.name);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Créer une saison</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une saison</DialogTitle>
        </DialogHeader>
        <form id="create-season" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            {...register("name")}
            required
            placeholder="Nom de la saison"
          />
        </form>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button type="submit" form="create-season" disabled={isPending}>
              Ajouter
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
