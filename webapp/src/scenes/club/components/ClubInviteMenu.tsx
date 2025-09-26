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
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Send } from "lucide-react";
import { toast } from "sonner";

export default function ClubInviteMenu({ disabled = false }) {
  const [, copyToClipboard] = useCopyToClipboard();

  function handleCopyLink() {
    copyToClipboard(window.location.href);
    toast.success("Le lien a été copié dans le presse-papiers.");
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
          <DropdownMenuLabel>Ajouter un membre</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem disabled>Inviter un ami</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onClick={handleCopyLink}>
            Copier le lien
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inviter un ami</DialogTitle>
          <DialogDescription>
            Le joueur recevra une notification.
          </DialogDescription>
        </DialogHeader>
        <div>todo</div>
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
