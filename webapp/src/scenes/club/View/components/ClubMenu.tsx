import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDeleteMember from "@/lib/member/useDeleteMember";
import { Ban, ChevronDownIcon, ClipboardSignature } from "lucide-react";
import { Link } from "wouter";
import ClubInviteMenu from "./ClubInviteMenu";

export default function ClubMenu({
  isMember,
  isAdmin,
  clubId,
}: {
  isMember: boolean;
  isAdmin: boolean;
  clubId: number;
}) {
  const { mutate, isPending } = useDeleteMember(clubId);

  function handleLeave() {
    if (window.confirm("Voulez-vous vraiment quitter ce club ?")) {
      mutate();
    }
  }

  return (
    <ButtonGroup>
      <ClubInviteMenu />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="!pl-2">
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link to="/edit">
                  <ClipboardSignature />
                  Modifier
                </Link>
              </DropdownMenuItem>
            )}
            {isMember && (
              <DropdownMenuItem onClick={handleLeave} disabled={isPending}>
                <Ban />
                Quitter
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
