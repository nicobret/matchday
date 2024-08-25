import { SessionContext } from "@/components/auth-provider";
import supabase from "@/utils/supabase";
import {
  ChevronUp,
  Search,
  Shield,
  Swords,
  TableProperties,
  Users,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tables } from "types/supabase";
import { fetchProfile } from "../account/account.service";
import { Club } from "../club/club.service";
import ClubCard from "./components/ClubCard";
import CreateDialog from "./components/CreateDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const { session } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Tables<"users">>();
  const [clubs, setClubs] = useState<Club[]>([]);

  async function getClubs() {
    try {
      const { data } = await supabase
        .from("clubs")
        .select("*, members: club_enrolments (*)")
        .is("deleted_at", null)
        .order("created_at")
        .throwOnError();
      if (data) setClubs(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getProfile() {
    try {
      const data = await fetchProfile();
      if (data) setProfile(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    if (!clubs.length) getClubs();
    if (session) getProfile();
    setLoading(false);
  }, [session]);

  const myClubs = clubs.filter((c) =>
    c.members?.some((m) => m.user_id === session?.user?.id),
  );

  const notMyClubs = clubs.filter(
    (c) => !c.members?.some((m) => m.user_id === session?.user?.id),
  );

  const [guideClosed, setGuideClosed] = useState(
    localStorage.getItem("guide-closed") === "true",
  );
  console.log("🚀 ~ Home ~ guideClosed:", guideClosed);

  if (loading) {
    return (
      <p className="animate-pulse text-center">Chargement des données...</p>
    );
  }

  if (profile && !profile?.firstname) {
    navigate("/account");
  }

  return (
    <div className="p-4">
      <section id="guide" className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h2
            className={`scroll-m-20 font-semibold tracking-tight transition-all ${guideClosed ? "text-base text-muted-foreground" : "text-2xl"}`}
          >
            Comment ça marche ?
          </h2>

          <button
            onClick={() => {
              if (guideClosed) {
                localStorage.removeItem("guide-closed");
                setGuideClosed(false);
              } else {
                localStorage.setItem("guide-closed", "true");
                setGuideClosed(true);
              }
            }}
            className={`transition-all ${guideClosed ? "rotate-180" : ""}`}
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        </div>

        {!guideClosed && (
          <>
            <p className="mt-4 text-lg">
              <Users className="mr-4 inline-block h-5 w-5 align-text-bottom text-primary" />
              Trouvez ou créez un club.
            </p>

            <p className="mt-2 text-lg">
              <Swords className="mr-4 inline-block h-5 w-5 align-text-bottom text-primary" />
              Inscrivez-vous à un match.
            </p>
            <p className="mt-2 text-lg">
              <TableProperties className="mr-4 inline-block h-5 w-5 align-text-bottom text-primary" />
              Enregistrez vos scores !
            </p>

            {session?.user && !profile?.firstname && (
              <div className="mt-4 text-center">
                <Link
                  to="/account"
                  className="text-primary underline underline-offset-2"
                >
                  Compléter mon profil
                </Link>
              </div>
            )}

            {!session?.user ? (
              <div className="mt-4 text-center">
                <Link
                  to={`/auth?redirectTo=${window.location.pathname}`}
                  className="text-primary underline underline-offset-2"
                >
                  C'est parti !
                </Link>
              </div>
            ) : null}
          </>
        )}
      </section>

      <section id="clubs" className="mt-8">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
          Clubs
        </h2>

        {session?.user ? <CreateDialog /> : null}

        <Tabs
          defaultValue={session?.user ? "club-list" : "search"}
          className="mt-6"
        >
          <TabsList className="w-full">
            <TabsTrigger
              value="club-list"
              disabled={!session?.user}
              className="w-1/2"
            >
              <Shield className="mr-2 inline-block h-4 w-4" />
              Mes clubs
            </TabsTrigger>
            <TabsTrigger value="search" className="w-1/2">
              <Search className="mr-2 inline-block h-4 w-4" />
              Trouver un club
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
