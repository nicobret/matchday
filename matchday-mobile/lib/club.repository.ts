import { supabase } from '@/lib/supabase';
import { Tables } from 'shared/types/supabase';

export type Club = Tables<"clubs"> & {
  members: (Tables<"club_member"> & {
    profile: Tables<"users">;
  })[];
};

export async function getClub(id: string): Promise<Club> {
  const { data, error } = await supabase
    .from("clubs")
    .select("*, members: club_member (*, profile: users(*))")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Club not found");
  }

  return data;
}

export async function getClubs(): Promise<Club[]> {
  const { data, error } = await supabase
    .from("clubs")
    .select("*, members: club_member (*, profile: users(*))")
    .is("deleted_at", null)
    .order("created_at");

  if (error) {
    throw error;
  }

  return data || [];
} 