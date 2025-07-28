import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
      <h2 className="mt-10 scroll-m-20 text-3xl font-semibold tracking-tight">
        Clubs
      </h2>

      <Tabs value={tab} onValueChange={setTab} className="mt-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="search" className="w-1/2 sm:w-44">
            <Search className="mr-2 inline-block h-4 w-4" />
            Trouver un club
          </TabsTrigger>
          <TabsTrigger
            value="club-list"
            disabled={isLoggedOut}
            className="w-1/2 sm:w-44"
          >
            <Shield className="mr-2 inline-block h-4 w-4" />
            Mes clubs
          </TabsTrigger>
        </TabsList>

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
            <Carousel className="mx-auto w-2/3 md:w-auto">
              <CarouselContent>
                {myClubs
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime(),
                  )
                  .map((club) => (
                    <CarouselItem
                      key={club.id}
                      className="sm:basis-1/2 md:basis-1/3"
                    >
                      <ClubCard key={club.id} club={club} isMember />
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <p className="text-center">Vous n'êtes membre d'aucun club</p>
          )}
        </TabsContent>

        <TabsContent value="search">
          <Carousel>
            <CarouselContent>
              {notMyClubs
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
                )
                .map((club) => (
                  <CarouselItem
                    key={club.id}
                    className="sm:basis-1/2 md:basis-1/3"
                  >
                    <ClubCard club={club} />
                  </CarouselItem>
                ))}
              <CarouselPrevious />
              <CarouselNext />
            </CarouselContent>
          </Carousel>
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
