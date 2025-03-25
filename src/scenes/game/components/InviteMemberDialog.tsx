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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMembers } from "@/scenes/club/lib/member/useMembers";
import { useForm } from "react-hook-form";
import useCreatePlayer from "../lib/player/useCreatePlayer";
import usePlayers from "../lib/player/usePlayers";

type FormValues = { userId: string };

export default function InviteMemberDialog({
  gameId,
  clubId,
  disabled,
}: {
  gameId: number;
  clubId: number;
  disabled: boolean;
}) {
  const { mutate: createPlayer } = useCreatePlayer(gameId);
  const { data: members, isPending } = useMembers(clubId);
  const { data: players } = usePlayers(gameId);
  const { handleSubmit, getValues, setValue } = useForm<FormValues>();
  const filteredMembers = members?.filter(
    (member) =>
      !players?.map((player) => player.user_id).includes(member.profile.id),
  );

  function onSubmit(data: FormValues) {
    console.log("🚀 ~ onSubmit ~ data:", data);
    createPlayer({ user_id: data.userId, status: "pending" });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled}>Inviter un membre du club</Button>
      </DialogTrigger>
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
              Inviter
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
