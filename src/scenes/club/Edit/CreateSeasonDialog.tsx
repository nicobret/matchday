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
import { useState } from "react";
import { useParams } from "wouter";
import useCreateSeason from "../lib/season/useCreateSeason";

export default function CreateSeasonDialog() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const { mutate, isPending } = useCreateSeason(Number(id));
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(name);
    setName("");
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
        <form id="create-season" onSubmit={handleSubmit}>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={handleChange}
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
