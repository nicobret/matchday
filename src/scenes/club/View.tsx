import { SessionContext } from "@/components/auth-provider";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Ban,
  Book,
  ClipboardSignature,
  MapPin,
  Menu,
  Shield,
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

  const userStatus =
    session && isAdmin(session?.user, club)
      ? "Vous êtes administrateur."
      : session && isMember(session?.user, club)
        ? "Vous êtes membre."
        : session
          ? "Vous n'êtes pas membre."
          : "Vous n'êtes pas connecté.";

  return (
    <div className="px-4">
      <Breadcrumbs links={[{ label: club.name || "Club", link: "#" }]} />

      <header className="my-8 flex gap-3">
        {/* <div className="h-32 w-32 flex-none rounded-xl border-2 border-dashed"></div> */}
        <div className="">
          <h1 className="line-clamp-1 text-3xl font-semibold tracking-tight">
            {club.name}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">{userStatus}</p>

          <div className="mt-2 flex gap-3">
            {!session || !isMember(session.user, club) ? (
              <Button onClick={() => handleJoin(club)} className="flex gap-2">
                <ClipboardSignature className="h-5 w-5" />
                Rejoindre
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="md:hidden">
                    <Menu className="mr-2 inline-block h-5 w-5" />
                    Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {session && isAdmin(session?.user, club) ? (
                    <DropdownMenuItem className="p-4">
                      <Link to={`/club/${club.id}/edit`} className="flex gap-2">
                        <ClipboardSignature className="inline-block h-5 w-5" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                  ) : null}

                  <DropdownMenuItem className="p-4">
                    <Button
                      onClick={() => handleLeave(club)}
                      variant="destructive"
                      className="flex gap-2"
                    >
                      <Ban className="inline-block h-5 w-5" />
                      Quitter
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

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

      <Tabs defaultValue="schedule" className="mt-8">
        <TabsList className="w-full">
          <TabsTrigger value="schedule">Calendrier</TabsTrigger>
          <TabsTrigger value="members">Membres</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <UpcomingGames club={club} />
        </TabsContent>
        <TabsContent value="members">
          <ClubMembers clubId={club.id} />
        </TabsContent>
        <TabsContent value="history">
          <ClubHistory clubId={club.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
