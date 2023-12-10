import { useState } from "react";
import supabaseClient from "@/utils/supabase";
import useStore from "@/utils/zustand";
import { useNavigate } from "react-router-dom";

export type clubType = {
  id: number;
  name: string;
  description: string;
  club_enrolments: Array<{ user_id: string }>;
};

export function useClubs() {
  const { session, setClubs } = useStore();
  const [loading, setLoading] = useState(false);
  const [club, setClub] = useState<clubType | null>(null);
  const navigate = useNavigate();

  async function fetchClubs() {
    setLoading(true);
    const { data, error } = await supabaseClient
      .from("clubs")
      .select(`id, name, description, club_enrolments ( user_id )`);
    if (error) console.error(error);
    if (data) setClubs(data);
    setLoading(false);
  }

  async function fetchClub(club_id: string) {
    setLoading(true);
    const { data, error } = await supabaseClient
      .from("clubs")
      .select(`id, name, description, club_enrolments ( user_id )`)
      .eq("id", parseInt(club_id));
    if (error) console.error(error);
    if (data) setClub(data[0]);
    setLoading(false);
  }

  async function updateClub(club_id: number, name: string) {
    const { data, error } = await supabaseClient
      .from("clubs")
      .update({ name })
      .eq("id", club_id)
      .select();
    if (error) {
      console.error(error);
    }
    console.log("🚀 ~ file: List.tsx:22 ~ join ~ data", data);
  }

  async function joinClub(club_id: number) {
    if (!session) {
      console.error("User must be logged in.");
      return;
    }

    const { data: club_enrolments, error: club_enrolments_error } =
      await supabaseClient
        .from("club_enrolments")
        .select("user_id")
        .eq("club_id", club_id);
    if (club_enrolments_error) {
      console.error(club_enrolments_error);
    }
    if (
      club_enrolments &&
      club_enrolments.find((m) => m.user_id === session.user.id)
    ) {
      window.alert("Vous avez déjà rejoint ce club !");
      return;
    }

    const { data, error } = await supabaseClient
      .from("club_enrolments")
      .insert({ club_id, user_id: session.user.id })
      .select();
    if (error) {
      console.error(error);
    }
    if (data) {
      await fetchClub(club_id.toString());
    }
  }

  async function leaveClub(club_id: number) {
    if (!session) {
      console.error("User must be logged in.");
      return;
    }
    if (window.confirm("Voulez-vous vraiment quitter ce club   ?")) {
      const { data, error } = await supabaseClient
        .from("club_enrolments")
        .delete()
        .eq("club_id", club_id)
        .select();
      if (error) {
        console.error(error);
      }
      if (data) {
        await fetchClub(club_id.toString());
      }
    }
  }

  async function createClub(name: string, description: string) {
    setLoading(true);
    if (!session) {
      console.error("User must be logged in.");
      return;
    }

    const { data, error } = await supabaseClient
      .from("clubs")
      .insert({
        creator_id: session.user.id,
        name,
        description,
      })
      .select();

    if (error) console.error(error);
    if (data) {
      window.alert("Club créé avec succès !");
      await fetchClubs();
      navigate(`/clubs/${data[0].id}`);
    }

    setLoading(false);
  }

  async function deleteClub(club_id: number) {
    if (window.confirm("Voulez-vous vraiment supprimer ce club ?")) {
      const { data, error } = await supabaseClient
        .from("clubs")
        .delete()
        .eq("id", club_id)
        .select();
      if (error) {
        console.error(error);
      }
      console.log("🚀 ~ file: List.tsx:22 ~ join ~ data", data);
    }
  }

  return {
    loading,
    club,
    fetchClubs,
    fetchClub,
    updateClub,
    joinClub,
    leaveClub,
    createClub,
    deleteClub,
  };
}
