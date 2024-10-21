import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import useCreatePlayer from "../../lib/useCreatePlayer";

export default function InviteDialog({
  gameId,
  disabled,
}: {
  gameId: number;
  disabled: boolean;
}) {
  const [name, setName] = useState("");
  const { mutate } = useCreatePlayer(gameId);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name) {
      window.alert("Veuillez renseigner un nom.");
    }
    mutate({ name });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => {}} disabled={disabled}>
          Ajouter un invité
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un joueur</DialogTitle>
          <DialogDescription>Non inscrit sur la plateforme.</DialogDescription>
        </DialogHeader>
        <form id="invite-form" onSubmit={handleSubmit}>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du joueur"
          />
        </form>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button type="submit" form="invite-form">
              Ajouter
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
