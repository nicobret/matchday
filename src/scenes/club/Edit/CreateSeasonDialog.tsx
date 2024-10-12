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

export default function CreateSeasonDialog({ clubId }: { clubId: number }) {
  const [name, setName] = useState("");
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await supabase.from("season").insert({ name, club_id: clubId });
      queryClient.invalidateQueries("seasons");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Ajouter</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une saison</DialogTitle>
        </DialogHeader>
        <form id="create-season" onSubmit={handleSubmit}>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </form>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button type="submit" form="create-season">
              Ajouter
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
