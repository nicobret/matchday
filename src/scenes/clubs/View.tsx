import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "@/utils/supabase";
import { Club, userIsMember } from "./clubs.service";

import { Check, ClipboardSignature } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import ClubInfo from "./components/ClubInfo";
import UpcomingGames from "./components/UpcomingGames";
import ClubMembers from "./components/ClubMembers";
import ClubHistory from "./components/ClubHistory";
import { SessionContext } from "@/App";

export default function View() {
  const { session } = useContext(SessionContext);
  const { id } = useParams();
  const [club, setClub] = useState<Club>();
  const [loading, setLoading] = useState(false);

  async function getClub(id: string) {
    try {
      setLoading(true);

      const { data, error } = await supabase
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

  async function joinClub() {
    try {
      setLoading(true);
      if (!session?.user) {
        throw new Error("User must be logged in.");
      }

      const { data: club_members, error: club_members_error } = await supabase
        .from("club_enrolments")
        .select("user_id")
        .eq("club_id", club.id);
      if (club_members_error) {
        throw new Error(club_members_error.message);
      }
      if (club_members.find((m) => m.user_id === session?.user.id)) {
        throw new Error("Vous avez déjà rejoint ce club !");
      }

      const { data, error } = await supabase
        .from("club_enrolments")
        .insert({ club_id: club.id, user_id: session?.user.id })
        .select();
      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setClub((prev) => {
          if (!prev) return prev;
          return { ...prev, members: [...prev.members, data[0]] };
        });
      }
    } catch (error) {
      window.alert(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function leaveClub() {
    try {
      setLoading(true);
      if (!session?.user) {
        throw new Error("User must be logged in.");
      }

      if (window.confirm("Voulez-vous vraiment quitter ce club ?")) {
        const { data, error } = await supabase
          .from("club_enrolments")
          .delete()
          .eq("club_id", club.id)
          .select();
        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          setClub((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              members: prev.members.filter(
                (m) => m.user_id !== session?.user.id
              ),
            };
          });
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

      <div className="flex gap-4 items-end scroll-m-20 border-b pb-3 mt-6 first:mt-0 mb-2">
        <h2 className="text-3xl font-semibold tracking-tight">{club.name}</h2>

        {session?.user &&
          (userIsMember(session.user, club) ? (
            <Button
              onClick={() => leaveClub()}
              variant="secondary"
              className="flex gap-2 ml-auto"
            >
              <Check className="h-5 w-5" />
              <span className="hidden md:block">Rejoint</span>
            </Button>
          ) : (
            <Button onClick={() => joinClub()} className="flex gap-2 ml-auto">
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
