import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../../../utils/zustand";
import { Club } from "../clubs.service";
import ClubCard from "./components/ClubCard";
import { Plus } from "lucide-react";
import Container from "@/layout/Container";
import { buttonVariants } from "@/components/ui/button";
import supabaseClient from "@/utils/supabase";

export default function List() {
  const { user } = useStore();
  const [loading, setLoading] = useState(false);
  const [clubs, setClubs] = useState<Club[]>([]);

  async function getClubs() {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from("clubs")
        .select("*, members: club_enrolments (*)")
        .order("created_at");
      if (error) {
        throw new Error(error.message);
      }
      setClubs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // async function createClub({
  //   name,
  //   description,
  //   address,
  //   postcode,
  //   city,
  //   country,
  // }: {
  //   name: string;
  //   description: string;
  //   address: string;
  //   postcode: string;
  //   city: string;
  //   country: string;
  // }) {
  //   setLoading(true);
  //   if (!user) {
  //     console.error("User must be logged in.");
  //     return;
  //   }

  //   const { data, error } = await supabaseClient
  //     .from("clubs")
  //     .insert({
  //       creator_id: user.id,
  //       name,
  //       description,
  //       address,
  //       postcode,
  //       city,
  //       country,
  //     })
  //     .select();

  //   if (error) {
  //     window.alert("Une erreur est survenue lors de la création du club.");
  //     console.error(error);
  //     setLoading(false);
  //     return;
  //   }

  //   if (data) {
  //     window.alert("Club créé avec succès !");
  //     navigate(`/clubs/${data[0].id}`);
  //   }

  //   setLoading(false);
  // }

  useEffect(() => {
    getClubs();
  }, []);

  const myClubs = clubs.filter((c) =>
    c.members.some((m) => m.user_id === user?.id)
  );

  const notMyClubs = clubs.filter(
    (c) => !c.members.some((m) => m.user_id === user?.id)
  );

  if (loading) {
    return <p className="text-center animate-pulse">Chargement...</p>;
  }

  if (!clubs) {
    return <p className="text-center">Aucun club</p>;
  }

  return (
    <Container>
      {user && (
        <>
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
            Mes clubs
          </h2>

          <div className="flex flex-wrap gap-6">
            {myClubs.length ? (
              myClubs.map((club) => <ClubCard key={club.id} club={club} />)
            ) : (
              <p className="text-center">Vous n'êtes membre d'aucun club</p>
            )}
          </div>
        </>
      )}

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-6">
        Trouver un club
      </h2>

      {user && (
        <Link to="/clubs/create" className={`${buttonVariants()} my-4`}>
          <Plus className="w-5 h-5 mr-2" />
          <p>Créer</p>
        </Link>
      )}

      <div className="flex flex-wrap gap-6">
        {notMyClubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </Container>
  );
}
