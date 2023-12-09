import { useState } from "react";
import supabaseClient from "@/utils/supabase";
import useStore from "@/utils/zustand";
import { useNavigate } from "react-router-dom";

export type clubType = {
  id: number;
  name: string;
  club_enrolments: Array<{ user_id: string }>;
};

export function useClubs() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [clubs, setClubs] = useState<clubType[]>([]);
  const [club, setClub] = useState<clubType | null>(null);
  const navigate = useNavigate();

  async function fetchClubs() {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from("clubs")
        .select(`id, name, club_enrolments ( user_id )`);
      if (error) throw error;
      if (data) setClubs(data);
    } catch (error) {
      console.error(error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchClub(club_id: number) {
    try {
      const { data, error } = await supabaseClient
        .from("clubs")
        .select(`id, name, club_enrolments ( user_id )`)
        .eq("id", club_id);

      if (error) throw error;

      if (data) {
        setClub(data[0]);
        await fetchClubs();
      }
    } catch (error) {
      console.error(error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
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

  async function joinClub(league_id: number) {
    const { data, error } = await supabaseClient
      .from("club_enrolments")
      .insert({ league_id })
      .select();
    if (error) {
      console.error(error);
    }
    console.log("🚀 ~ file: List.tsx:22 ~ join ~ data", data);
  }

  async function leaveClub(club_id: number) {
    if (window.confirm("Voulez-vous vraiment quitter cette ligue ?")) {
      const { data, error } = await supabaseClient
        .from("club_enrolments")
        .delete()
        .eq("club_id", club_id)
        .select();
      if (error) {
        console.error(error);
      }
      console.log("🚀 ~ file: List.tsx:22 ~ join ~ data", data);
    }
  }

  async function createClub(name: string) {
    try {
      setLoading(true);

      const { session } = useStore();
      if (!session) throw new Error("No session found");

      const { data, error } = await supabaseClient
        .from("clubs")
        .insert({
          creator_id: session.user.id,
          name,
        })
        .select();

      if (error) throw error;

      if (data) {
        window.alert("Club créé avec succès !");
        await fetchClubs();
        navigate(`/clubs/${data[0].id}`);
      }
    } catch (error) {
      console.error(error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
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
    error,
    clubs,
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
