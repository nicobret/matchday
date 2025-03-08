import { SessionContext } from "@/components/auth-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Shield } from "lucide-react";
import { useContext } from "react";
import ClubCard from "./components/ClubCard";
import CreateDialog from "./components/CreateDialog";
import Guide from "./components/Guide";
import useClubs from "./useClubs";
import useProfile from "./useProfile";

export default function Home() {
  const { session } = useContext(SessionContext);
  const { data: profile, isPending: loadingProfile } = useProfile({ session });
  const { data: clubs, isError, isPending } = useClubs();

  if (loadingProfile) {
    return (
      <p className="animate-pulse text-center">Chargement des données...</p>
    );
  }

  if (isPending) {
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

  const defaultTab = myClubs.length > 0 ? "club-list" : "search";

  return (
    <div className="mx-auto max-w-5xl p-4">
      <Guide profile={profile} />

      <section id="clubs" className="mt-8">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
          Clubs
        </h2>

        <Tabs defaultValue={defaultTab} className="mt-4">
          <div className="my-4 flex gap-4">
            <TabsList>
              <TabsTrigger value="search" className="w-44">
                <Search className="mr-2 inline-block h-4 w-4" />
                Trouver un club
              </TabsTrigger>
              <TabsTrigger
                value="club-list"
                disabled={!session?.user}
                className="w-44"
              >
                <Shield className="mr-2 inline-block h-4 w-4" />
                Mes clubs
              </TabsTrigger>
            </TabsList>
          </div>
          {session?.user ? <CreateDialog /> : null}

          <TabsContent value="club-list">
            <div className="mt-4 flex flex-wrap gap-4">
              {myClubs.length ? (
                myClubs
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime(),
                  )
                  .map((club) => (
                    <ClubCard key={club.id} club={club} isMember />
                  ))
              ) : (
                <p className="text-center">Vous n'êtes membre d'aucun club</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="search">
            <div className="mt-4 flex flex-wrap gap-4">
              {notMyClubs
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
                )
                .map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
