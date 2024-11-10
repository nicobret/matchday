import { SessionContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";
import { useContext, useState } from "react";
import { useLocation } from "wouter";
import { Club, deleteClub } from "../lib/club.service";

export default function DeleteClub({ club }: { club: Club }) {
  const [loading, setLoading] = useState(false);
  const { session } = useContext(SessionContext);
  const [_location, navigate] = useLocation();
  const { toast } = useToast();

  async function handleDelete() {
    setLoading(true);
    try {
      if (!session?.user) {
        throw new Error("Vous devez être connecté pour supprimer un club.");
      }
      if (session.user?.id !== club.creator_id) {
        throw new Error("Vous n'êtes pas autorisé à supprimer ce club.");
      }
      if (window.confirm("Voulez-vous vraiment supprimer ce club ?")) {
        await deleteClub(club);
        toast({ description: "Club supprimé avec succès" });
        navigate("/");
      }
    } catch (error) {
      window.alert(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Button
      type="button"
      variant="destructive"
      disabled={loading || club.creator_id !== session?.user?.id}
      onClick={handleDelete}
    >
      <Trash className="mr-2 h-5 w-5" />
      Supprimer
    </Button>
  );
}
