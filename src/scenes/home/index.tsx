import { SessionContext } from "@/components/auth-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Shield } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ClubCard from "./components/ClubCard";
import CreateDialog from "./components/CreateDialog";
import Guide from "./components/Guide";
import useClubs from "./useClubs";
import useProfile from "./useProfile";

export default function Home() {
  const { session } = useContext(SessionContext);
  const navigate = useNavigate();
  const { data: profile, isLoading: loadingProfile } = useProfile({ session });
  const { data: clubs, isError, isIdle, isLoading } = useClubs();

  if (loadingProfile) {
    return (
      <p className="animate-pulse text-center">Chargement des données...</p>
    );
  }
  // Redirect to account page if profile is not complete
  if (profile && !profile?.firstname) {
    navigate("/account");
  }
  if (isLoading || isIdle) {
    return <p className="animate-pulse text-center">Chargement des clubs...</p>;
  }
  if (isError) {
    return <p className="text-center">Une erreur est survenue.</p>;
  }

  const myClubs = clubs.filter((c) =>
    c.members?.some((m) => m.user_id === session?.user?.id),
  );
  const notMyClubs = clubs.filter(
    (c) => !c.members?.some((m) => m.user_id === session?.user?.id),
  );

  return (
    <div className="p-4">
      <Guide profile={profile} />

      <section id="clubs" className="mt-12">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
          Clubs
        </h2>

        <div className="mt-6">{session?.user ? <CreateDialog /> : null}</div>

        <Tabs
          defaultValue={session?.user ? "club-list" : "search"}
          className="mt-8"
        >
          <TabsList className="w-full">
            <TabsTrigger value="search" className="w-1/2">
              <Search className="mr-2 inline-block h-4 w-4" />
              Trouver un club
            </TabsTrigger>
            <TabsTrigger
              value="club-list"
              disabled={!session?.user}
              className="w-1/2"
            >
              <Shield className="mr-2 inline-block h-4 w-4" />
              Mes clubs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="club-list">
            <div className="mt-4 flex flex-wrap gap-4">
              {myClubs.length ? (
                myClubs.map((club) => (
                  <ClubCard key={club.id} club={club} isMember />
                ))
              ) : (
                <p className="text-center">Vous n'êtes membre d'aucun club</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="search">
            <div className="mt-4 flex flex-wrap gap-4">
              {notMyClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
