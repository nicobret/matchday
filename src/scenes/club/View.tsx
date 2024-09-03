import { SessionContext } from "@/components/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import {
  ArrowLeft,
  Ban,
  Book,
  Calendar,
  ClipboardSignature,
  Copy,
  History,
  MapPin,
  Shield,
  Users,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Club,
  fetchClub,
  isAdmin,
  isMember,
  joinClub,
  leaveClub,
} from "./club.service";
import ClubHistory from "./components/ClubHistory";
import ClubMembers from "./components/ClubMembers";
import UpcomingGames from "./components/UpcomingGames";

export default function View() {
  const { session } = useContext(SessionContext);
  const { id } = useParams();
  const [club, setClub] = useState<Club>();
  const [loading, setLoading] = useState(false);
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  async function handleJoin(club: Club) {
    if (!session?.user) {
      if (window.confirm("Pour vous inscrire, veuillez vous connecter.")) {
        window.location.href = "/auth?redirectTo=" + window.location.pathname;
      }
      return;
    }

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
    if (!window.confirm("Voulez-vous vraiment quitter ce club ?")) {
      return;
    }

    try {
      if (!session?.user) {
        throw new Error("Vous n'êtes pas connecté.");
      }
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

  const userStatus =
    session && isAdmin(session?.user, club)
      ? "✓ Vous êtes administrateur"
      : session && isMember(session?.user, club)
        ? "✓ Vous êtes membre."
        : session
          ? "Vous n'êtes pas membre."
          : "Vous n'êtes pas connecté(e)";

  return (
    <div className="p-4">
      <Link to="/" className="text-sm text-muted-foreground">
        <ArrowLeft className="mr-2 inline-block h-4 w-4 align-text-top" />
        Retour à l'accueil
      </Link>

      <header className="mt-8 flex gap-4">
        <div className="h-28 w-28 flex-none rounded-xl border-2 border-dashed"></div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{club.name}</h1>

          <p
            className={`mt-2 text-sm text-muted-foreground ${session && isMember(session.user, club) ? "text-primary" : ""}`}
          >
            {userStatus}
          </p>
        </div>
      </header>

      <div className="mt-4 grid max-w-lg grid-cols-2 gap-2">
        {!session || !isMember(session.user, club) ? (
          <Button onClick={() => handleJoin(club)} className="flex gap-2">
            <ClipboardSignature className="h-5 w-5" />
            Rejoindre
          </Button>
        ) : (
          <Button
            onClick={() => handleLeave(club)}
            variant="secondary"
            className="flex gap-2"
          >
            <Ban className="inline-block h-5 w-5" />
            Quitter
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={() => copyToClipboard(window.location.href)}
        >
          <Copy className="mr-2 inline-block h-5 w-5" />
          {copiedText ? "Copié !" : "Copier le lien"}
        </Button>

        {session && isAdmin(session?.user, club) && (
          <Link
            to={`/club/${club.id}/edit`}
            className={buttonVariants({ variant: "secondary" })}
          >
            <ClipboardSignature className="mr-2 inline-block h-5 w-5" />
            Modifier
          </Link>
        )}
      </div>

      <div className="mt-10 max-w-lg rounded-lg border p-4">
        <p>
          <Shield className="mr-2 inline-block h-5 w-5" />
          Créé le{" "}
          {new Date(club.created_at).toLocaleDateString("fr-FR", {
            dateStyle: "long",
          })}
        </p>

        {club.description && (
          <p className="mt-2 leading-relaxed">
            <Book className="mr-2 inline-block h-5 w-5" />
            {club.description}
          </p>
        )}

        <div className="mt-2 flex gap-2">
          <MapPin className="h-5 w-5" />
          {club.address && club.postcode && club.city ? (
            <div>
              <p className="leading-relaxed">{club.address}</p>
              <p>
                {club.postcode} {club.city}
              </p>
            </div>
          ) : (
            <p className="leading-relaxed">Adresse non renseignée.</p>
          )}
        </div>
      </div>

      <Tabs defaultValue="schedule" className="mt-10">
        <TabsList className="w-full">
          <TabsTrigger value="schedule" className="w-1/3">
            <Calendar className="mr-2 inline-block h-4 w-4" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="members" className="w-1/3">
            <Users className="mr-2 inline-block h-4 w-4" />
            Membres
          </TabsTrigger>
          <TabsTrigger value="history" className="w-1/3">
            <History className="mr-2 inline-block h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <UpcomingGames club={club} />
        </TabsContent>
        <TabsContent value="members">
          <ClubMembers clubId={club.id} />
        </TabsContent>
        <TabsContent value="history">
          <ClubHistory club={club} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
