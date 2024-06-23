import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Club, joinClub, isMember, fetchClub, leaveClub } from "./club.service";
import { SessionContext } from "@/components/auth-provider";
import { Check, ClipboardSignature } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import ClubInfo from "./components/ClubInfo";
import UpcomingGames from "./components/UpcomingGames";
import ClubMembers from "./components/ClubMembers";
import ClubHistory from "./components/ClubHistory";

export default function View() {
  const { session } = useContext(SessionContext);
  const { id } = useParams();
  const [club, setClub] = useState<Club>();
  const [loading, setLoading] = useState(false);

  async function handleJoin(club: Club) {
    try {
      if (!session?.user) {
        throw new Error("User must be logged in.");
      }
      setLoading(true);
      const data = await joinClub(club.id, session.user.id);
      setClub((prev) => {
        if (!prev) return prev;
        return { ...prev, members: [...prev.members, data] };
      });
    } catch (error) {
      window.alert(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLeave(club: Club) {
    try {
      if (!session?.user) {
        throw new Error("Vous n'êtes pas connecté.");
      }
      if (window.confirm("Voulez-vous vraiment quitter ce club ?")) {
        setLoading(true);
        await leaveClub(club.id, session.user.id);
        setClub((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            members: prev.members.filter((m) => m.user_id !== session?.user.id),
          };
        });
      }
    } catch (error) {
      window.alert(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchClub(parseInt(id))
        .then((data) => setClub(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <p className="animate_pulse text-center">Chargement...</p>;
  }
  if (!club) {
    return <p className="text-center">Club non trouvé</p>;
  }
  return (
    <div className="p-4">
      <Breadcrumbs links={[{ label: club.name || "Club", link: "#" }]} />

      <div className="mb-2 mt-6 flex scroll-m-20 items-end gap-4 border-b pb-3 first:mt-0">
        <h1 className="text-3xl font-semibold tracking-tight">{club.name}</h1>

        {session?.user &&
          (isMember(session.user, club) ? (
            <Button
              onClick={() => handleLeave(club)}
              variant="secondary"
              className="ml-auto flex gap-2"
            >
              <Check className="h-5 w-5" />
              <span className="hidden md:block">Rejoint</span>
            </Button>
          ) : (
            <Button
              onClick={() => handleJoin(club)}
              className="ml-auto flex gap-2"
            >
              <ClipboardSignature className="h-5 w-5" />
              Rejoindre
            </Button>
          ))}
      </div>

      <div className="grid grid-cols-1 gap-4 py-2 md:grid-cols-3">
        <ClubInfo club={club} />
        <UpcomingGames club={club} />
        <ClubMembers clubId={club.id} />
        <ClubHistory clubId={club.id} />
      </div>
    </div>
  );
}
