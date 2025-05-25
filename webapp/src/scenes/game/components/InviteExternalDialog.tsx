import { Button, buttonVariants } from "@/components/ui/button";
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
import { useForm } from "react-hook-form";
import useCreatePlayer from "../lib/player/useCreatePlayer";

type FormValues = { name: string };

export default function InviteExternalDialog({
  gameId,
  disabled,
}: {
  gameId: number;
  disabled: boolean;
}) {
  const { register, handleSubmit } = useForm<FormValues>();
  const { mutate } = useCreatePlayer(gameId);

  function onSubmit(data: FormValues) {
    mutate({ name: data.name });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          className={buttonVariants({ variant: "secondary" })}
        >
          Ajouter un joueur extérieur à la plateforme
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un joueur extérieur à la plateforme</DialogTitle>
          <DialogDescription>
            Il s'agit d'un profil temporaire qui n'existera que dans le cadre de
            ce match.
          </DialogDescription>
        </DialogHeader>
        <form id="invite-form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            placeholder="Nom du joueur"
            {...register("name", { required: true })}
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
