import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/lib/auth/useAuth";
import useClubs from "@/lib/club/useClubs";
import { Search, Shield } from "lucide-react";
import { useQueryState } from "nuqs";
import ClubCarousel from "./ClubCarousel";
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
      <h2 className="mt-10 scroll-m-20 text-3xl font-semibold tracking-tight">
        Clubs
      </h2>

      <Tabs value={tab} onValueChange={setTab} className="mt-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger
            value="club-list"
            disabled={isLoggedOut}
            className="w-1/2 sm:w-44"
          >
            <Shield className="mr-2 inline-block h-4 w-4" />
            Mes clubs
          </TabsTrigger>

          <TabsTrigger value="search" className="w-1/2 sm:w-44">
            <Search className="mr-2 inline-block h-4 w-4" />
            Trouver un club
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <ClubCarousel clubs={notMyClubs} />
        </TabsContent>

        <TabsContent value="club-list">
          {isPending ? (
            <p className="animate-pulse text-center">Chargement des clubs...</p>
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
            <ClubCarousel clubs={myClubs} />
          ) : (
            <p className="text-center">Vous n'êtes membre d'aucun club</p>
          )}
        </TabsContent>
      </Tabs>

      {isLoggedIn ? (
        <div className="mt-4">
          <CreateDialog />
        </div>
      ) : null}
    </section>
  );
}
