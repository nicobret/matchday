import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/lib/auth/useAuth";
import useClubs from "@/lib/club/useClubs";
import { Search, Shield } from "lucide-react";
import { useQueryState } from "nuqs";
import ClubCard from "./ClubCard";
import CreateDialog from "./CreateDialog";

export default function ClubSection() {
  const { session, isLoggedIn, isLoggedOut } = useAuth();
  const { data: clubs, isError, isPending } = useClubs();
  const myClubs =
    clubs?.filter((c) =>
      c.members?.some((m) => m.user_id === session?.user?.id),
    ) ?? [];
  const notMyClubs =
    clubs?.filter(
      (c) => !c.members?.some((m) => m.user_id === session?.user?.id),
    ) ?? [];
  const defaultTab = myClubs.length > 0 ? "club-list" : "search";
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: defaultTab,
    clearOnDefault: false,
  });

  return (
    <section id="clubs">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
        Clubs
      </h2>

      <Tabs value={tab} onValueChange={setTab} className="mt-4">
        <div className="my-4 flex gap-4">
          <TabsList>
            <TabsTrigger value="search" className="w-44">
              <Search className="mr-2 inline-block h-4 w-4" />
              Trouver un club
            </TabsTrigger>
            <TabsTrigger
              value="club-list"
              disabled={isLoggedOut}
              className="w-44"
            >
              <Shield className="mr-2 inline-block h-4 w-4" />
              Mes clubs
            </TabsTrigger>
          </TabsList>
        </div>
        {isLoggedIn ? <CreateDialog /> : null}

        <TabsContent value="club-list">
          <div className="mt-4 flex flex-wrap gap-4">
            {isPending ? (
              <p className="animate-pulse text-center">
                Chargement des clubs...
              </p>
            ) : isError ? (
              <p className="text-center">Une erreur est survenue.</p>
            ) : myClubs.length === 0 ? (
              <p className="text-center">
                Vous n'êtes membre d'aucun club.{" "}
                <span className="text-primary underline underline-offset-2">
                  <a href="#search">Trouvez un club</a>
                </span>
              </p>
            ) : myClubs.length ? (
              myClubs
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
                )
                .map((club) => <ClubCard key={club.id} club={club} isMember />)
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
  );
}
