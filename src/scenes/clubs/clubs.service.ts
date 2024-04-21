import { User } from "@supabase/supabase-js";
import { Tables } from "types/supabase";

export type Club = Tables<"clubs"> & {
  members: Tables<"club_enrolments">[] | null;
};

export function userIsInClub(user: User, club: Club) {
  return club.members.map((m) => m.user_id).includes(user.id);
}

export function userIsAdmin(user: User, club: Club) {
  return club.members
    .filter((m) => m.role === "admin")
    .map((m) => m.user_id)
    .includes(user.id);
}
