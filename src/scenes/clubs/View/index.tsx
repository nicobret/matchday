import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Check, ClipboardSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import useStore from "@/utils/zustand";

import { Club, userIsInClub } from "../clubs.service";
import Breadcrumbs from "@/components/Breadcrumbs";
import supabaseClient from "@/utils/supabase";
import ClubInfo from "./components/ClubInfo";
import UpcomingGames from "./components/UpcomingGames";
import ClubMembers from "./components/ClubMembers";
import ClubHistory from "./components/ClubHistory";

export default function View() {
  const { user } = useStore();
  const { id } = useParams();
  const [club, setClub] = useState<Club>();
  const [loading, setLoading] = useState(false);

  async function getClub(id: string) {
    try {
      setLoading(true);

      const { data, error } = await supabaseClient
        .from("clubs")
        .select("*, members: club_enrolments (*)")
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);
      if (data) setClub(data);
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

  // async function deleteClub(club_id: number) {
  //   if (window.confirm("Voulez-vous vraiment supprimer ce club ?")) {
  //     const { error } = await supabaseClient
  //       .from("clubs")
  //       .delete()
  //       .eq("id", club_id)
  //       .select();
  //     if (error) {
  //       console.error(error);
  //     }
  //   }
  // }

  async function joinClub(club_id: number) {
    try {
      setLoading(true);
      if (!user) {
        throw new Error("User must be logged in.");
      }

      const { data: club_enrolments, error: club_enrolments_error } =
        await supabaseClient
          .from("club_enrolments")
          .select("user_id")
          .eq("club_id", club_id);
      if (club_enrolments_error) {
        throw new Error(club_enrolments_error.message);
      }
      if (club_enrolments.find((m) => m.user_id === user.id)) {
        throw new Error("Vous avez déjà rejoint ce club !");
      }

      const { data, error } = await supabaseClient
        .from("club_enrolments")
        .insert({ club_id, user_id: user.id })
        .select();
      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        await getClub(club_id.toString());
      }
    } catch (error) {
      window.alert(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function leaveClub(club_id: number) {
    try {
      setLoading(true);
      if (!user) {
        throw new Error("User must be logged in.");
      }

      if (window.confirm("Voulez-vous vraiment quitter ce club ?")) {
        const { data, error } = await supabaseClient
          .from("club_enrolments")
          .delete()
          .eq("club_id", club_id)
          .select();
        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          await getClub(club_id.toString());
        }
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
      getClub(id);
    }
  }, [id]);

  if (loading) {
    return <p className="text-center animate_pulse">Chargement...</p>;
  }

  if (!club) {
    return <p className="text-center">Club non trouvé</p>;
  }

  return (
    <div className="p-4">
      <Breadcrumbs links={[{ label: club.name, link: "#" }]} />

      <div className="flex gap-4 items-end scroll-m-20 border-b pb-3 mt-6 mb-2">
        <h2 className="text-3xl font-semibold tracking-tight">{club.name}</h2>

        {user &&
          (userIsInClub(user, club) ? (
            <Button
              onClick={() => leaveClub(club.id)}
              variant="secondary"
              className="flex gap-2 ml-auto"
            >
              <Check className="h-5 w-5" />
              <span className="hidden md:block">Rejoint</span>
            </Button>
          ) : (
            <Button
              onClick={() => joinClub(club.id)}
              className="flex gap-2 ml-auto"
            >
              <ClipboardSignature className="h-5 w-5" />
              Rejoindre
            </Button>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
        <ClubInfo club={club} />
        <UpcomingGames club={club} />
        <ClubMembers clubId={club.id} />
        <ClubHistory clubId={club.id} />
      </div>
    </div>
  );
}
