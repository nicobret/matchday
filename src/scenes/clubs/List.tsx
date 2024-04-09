import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../../utils/zustand";
import { useClubs } from "./useClubs";
import ClubCard from "./components/ClubCard";
import { Plus } from "lucide-react";
import { clubSummary } from "./clubs.service";
import Container from "@/layout/Container";
import { buttonVariants } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function List() {
  const [loading, setLoading] = useState(false);
  const [clubs, setClubs] = useState<clubSummary[] | null>(null);
  const { fetchClubs } = useClubs();

  async function getClubs() {
    setLoading(true);
    const clubs = await fetchClubs();
    if (!clubs) {
      setLoading(false);
      return;
    }
    setClubs(clubs as unknown as clubSummary[]);
    setLoading(false);
  }

  useEffect(() => {
    getClubs();
  }, []);

  const { session } = useStore();

  const myClubs = clubs?.filter((c) =>
    c.members.some((m) => m.id === session?.user.id)
  );

  const notMyClubs = clubs?.filter(
    (c) => !c.members.some((m) => m.id === session?.user.id)
  );

  if (loading)
    return <p className="text-center animate-pulse">Chargement...</p>;

  if (!clubs) return <p className="text-center">Aucun club</p>;

  return (
    <Container>
      <Breadcrumbs links={[{ label: "Liste des clubs", link: "#" }]} />

      {session && (
        <>
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-6 mb-4">
            Mes clubs
          </h2>

          <div className="flex flex-wrap gap-6">
            {myClubs?.map((c) => <ClubCard key={c.id} {...c} />)}
          </div>
        </>
      )}

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-6">
        Trouver un club
      </h2>

      {session && (
        <Link to="/clubs/create" className={`${buttonVariants()} my-4`}>
          <Plus className="w-5 h-5 mr-2" />
          <p>Créer</p>
        </Link>
      )}

      <div className="flex flex-wrap gap-6">
        {notMyClubs
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .map((c) => (
            <ClubCard key={c.id} {...c} />
          ))}
      </div>
    </Container>
  );
}
