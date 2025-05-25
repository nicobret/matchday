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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMembers } from "@/scenes/club/lib/member/useMembers";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import useCreatePlayer from "../lib/player/useCreatePlayer";
import usePlayers from "../lib/player/usePlayers";

type FormValues = { userId: string };

export default function InviteMenu({
  gameId,
  clubId,
  disabled,
}: {
  gameId: number;
  clubId: number;
  disabled: boolean;
}) {
  const { toast } = useToast();
  const [, copyToClipboard] = useCopyToClipboard();
  const { mutate: createPlayer } = useCreatePlayer(gameId);
  const { data: members, isPending } = useMembers(clubId);
  const { data: players } = usePlayers(gameId);
  const { handleSubmit, getValues, setValue } = useForm<FormValues>();
  const filteredMembers = members?.filter(
    (member) =>
      !players?.map((player) => player.user_id).includes(member.profile.id),
  );

  function onSubmit(data: FormValues) {
    createPlayer({ user_id: data.userId, status: "pending" });
    toast({
      title: "Invitation envoyée",
      description: "Le joueur a été invité avec succès.",
    });
    setValue("userId", "");
  }

  function handleCopyLink() {
    copyToClipboard(window.location.href);
    toast({
      title: "Lien copié",
      description: "Le lien a été copié dans le presse-papiers.",
    });
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={disabled} variant="secondary">
            <Send />
            Inviter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Inviter un joueur</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>Inviter un membre du club</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onClick={handleCopyLink}>
            Copier le lien
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inviter un membre du club</DialogTitle>
          <DialogDescription>
            Le joueur recevra une notification.
          </DialogDescription>
        </DialogHeader>
        <form id="invite-member-form" onSubmit={handleSubmit(onSubmit)}>
          <Select
            defaultValue={getValues("userId")}
            onValueChange={(value) => setValue("userId", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez un membre" />
            </SelectTrigger>
            <SelectContent>
              {isPending ? (
                <p>Chargement...</p>
              ) : (
                filteredMembers?.map((member) => (
                  <SelectItem key={member.id} value={member.user_id}>
                    {member.profile.firstname} {member.profile.lastname}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </form>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button type="submit" form="invite-member-form">
              Envoyer
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
