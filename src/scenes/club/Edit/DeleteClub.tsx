import { SessionContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useContext } from "react";
import { useLocation } from "wouter";
import { Club } from "../lib/club/club.service";
import useDeleteClub from "../lib/club/useDeleteClub";

export default function DeleteClub({ club }: { club: Club }) {
  const { session } = useContext(SessionContext);
  const [_location, navigate] = useLocation();
  const { mutate, isPending } = useDeleteClub(club.id);
  const disabled =
    isPending || !session?.user || club.creator_id !== session?.user?.id;

  function handleClick() {
    if (window.confirm("Voulez-vous vraiment supprimer ce club ?")) {
      mutate(undefined, {
        onSuccess: () => {
          navigate("~/");
        },
      });
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      disabled={disabled}
      onClick={handleClick}
    >
      <Trash className="mr-2 h-5 w-5" />
      Supprimer
    </Button>
  );
}
