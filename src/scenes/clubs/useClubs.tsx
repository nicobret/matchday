import { useEffect, useState } from "react";
import supabaseClient from "@/utils/supabase";
import useStore from "@/utils/zustand";
import { useNavigate } from "react-router-dom";

export function useClubs(id = "") {
  const { session } = useStore();
  const [loading, setLoading] = useState(false);
  const [club, setClub] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) fetchClub(id);
  }, [id]);

  async function fetchClub(club_id: string) {
    setLoading(true);
    const { data, error } = await supabaseClient
      .from("clubs")
      .select(
        `
          id,
          name,
          description,
          address,
          postcode,
          city,
          country,
          created_at,
          members: club_enrolments ( id: user_id, role, created_at, profile: users ( id, firstname, lastname, avatar, status ) ),
          creator: users ( id, firstname, lastname, avatar, status ),
          games!games_club_id_fkey ( id, date, location, status, created_at, score, player_count: game_registrations ( count ) )
        `
      )
      .eq("id", parseInt(club_id))
      .single();
    if (error) {
      console.error(error);
      setLoading(false);
    }
    if (data) {
      setClub(data);
      setLoading(false);
      return data;
    }
  }

  async function fetchClubs() {
    const { data, error } = await supabaseClient.from("clubs").select(
      `
        id,
        name,
        description,
        created_at,
        members: club_enrolments ( id: user_id, role ),
        creator: users ( id, firstname, lastname, avatar, status )
      `
    );
    if (error) console.error(error);
    if (data) return data;
  }

  async function updateClub({
    id,
    name,
    description,
    address,
    postcode,
    city,
    country,
  }: {
    id: string;
    name: string;
    description: string;
    address: string;
    postcode: string;
    city: string;
    country: string;
  }) {
    setLoading(true);

    if (!session) {
      window.alert("Vous devez être connecté pour modifier un club.");
      return;
    }

    const { error } = await supabaseClient
      .from("clubs")
      .update({ name, description, address, postcode, city, country })
      .eq("id", parseInt(id));

    if (error) {
      window.alert("Une erreur est survenue lors de la modification du club.");
      console.error(error);
      setLoading(false);
      return;
    }

    window.alert("Club modifié avec succès !");
    setLoading(false);
    navigate(`/clubs/${id}`);
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

  async function createClub({
    name,
    description,
    address,
    postcode,
    city,
    country,
  }: {
    name: string;
    description: string;
    address: string;
    postcode: string;
    city: string;
    country: string;
  }) {
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
        address,
        postcode,
        city,
        country,
      })
      .select();

    if (error) {
      window.alert("Une erreur est survenue lors de la création du club.");
      console.error(error);
      setLoading(false);
      return;
    }

    if (data) {
      window.alert("Club créé avec succès !");
      await fetchClubs();
      navigate(`/clubs/${data[0].id}`);
    }

    setLoading(false);
  }

  async function deleteClub(club_id: number) {
    if (window.confirm("Voulez-vous vraiment supprimer ce club ?")) {
      const { error } = await supabaseClient
        .from("clubs")
        .delete()
        .eq("id", club_id)
        .select();
      if (error) {
        console.error(error);
      }
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
