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
import { queryClient } from "@/lib/react-query";
import supabase from "@/utils/supabase";
import { useState } from "react";
import { Tables } from "types/supabase";

export default function UpdateSeasonDialog({
  season,
}: {
  season: Tables<"season">;
}) {
  const [name, setName] = useState(season.name);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await supabase.from("season").update({ name }).eq("id", season.id);
      queryClient.invalidateQueries("seasons");
    } catch (error) {
      console.error(error);
    }
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
        <form id="update-season" onSubmit={handleSubmit}>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
