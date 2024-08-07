import { SessionContext } from "@/components/auth-provider";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Check, ClipboardSignature } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Club, fetchClub, isMember, joinClub, leaveClub } from "./club.service";
import ClubHistory from "./components/ClubHistory";
import ClubInfo from "./components/ClubInfo";
import ClubMembers from "./components/ClubMembers";
import UpcomingGames from "./components/UpcomingGames";

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
      if (club.members?.some((m) => m.user_id === session.user.id)) {
        throw new Error("User is already a member.");
      }
      setLoading(true);
      const data = await joinClub(club.id, session.user.id);
      setClub((prev) => {
        if (!prev) return prev;
        return { ...prev, members: [...(prev.members || []), data] };
      });
    } catch (error) {
      window.alert("Une erreur est survenue.");
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
            members: (prev.members || []).filter(
              (m) => m.user_id !== session?.user.id,
            ),
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
      <div className="mb-4 mt-8 flex scroll-m-20 items-end gap-4 first:mt-0">
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

      {session ? null : (
        <Alert className="mb-2">
          <AlertTitle>A savoir</AlertTitle>
          <AlertDescription>
            Pour rejoindre un club, veuillez{" "}
            <Link
              to="/auth"
              className="decoration- underline underline-offset-4"
            >
              vous connecter
            </Link>
            .
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 gap-4 py-2 md:grid-cols-3">
        <ClubInfo club={club} />
        <UpcomingGames club={club} />
        <ClubMembers clubId={club.id} />
        <ClubHistory clubId={club.id} />
      </div>
    </div>
  );
}
