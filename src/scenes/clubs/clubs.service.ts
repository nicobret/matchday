import supabaseClient from "@/utils/supabase";

export type clubType = {
  id: number;
  name: string;
  club_enrolments: Array<{ user_id: string }>;
};

export async function fetchClubs() {
  const { data, error } = await supabaseClient
    .from("clubs")
    .select(`id, name, club_enrolments ( user_id )`);
  if (error) {
    console.error(error);
    return null;
  }
  return data;
}

export async function joinClub(league_id: number) {
  const { data, error } = await supabaseClient
    .from("club_enrolments")
    .insert({ league_id })
    .select();
  if (error) {
    console.error(error);
  }
  console.log("🚀 ~ file: List.tsx:22 ~ join ~ data", data);
}

export async function leaveClub(club_id: number) {
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

export async function createClub(name: string) {
  const { data: userData } = await supabaseClient.auth.getUser();
  const { user } = userData;
  if (!user) {
    return;
  }
  const { data, error } = await supabaseClient
    .from("clubs")
    .insert({
      creator_id: user.id,
      name: name,
    })
    .select();
  if (error) {
    console.error(error);
  }
  window.alert("Club créé avec succès !");
  console.log("🚀 ~ file: CreateLeague.tsx:22 ~ onSubmit ~ data:", data);
}

export async function deleteClub(club_id: number) {
  if (window.confirm("Voulez-vous vraiment supprimer cette ligue ?")) {
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
