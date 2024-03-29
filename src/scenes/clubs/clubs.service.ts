import { gameSummary } from "../games/games.service";
import { clubMember } from "../users/users.service";

export type clubType = {
  id: number;
  name: string | null;
  description: string;
  created_at: Date;
  members: Array<clubMember>;
  creator: {
    id: string;
    firstname: string;
    lastname: string;
    avatar: string;
    status: string;
  };
  games: Array<gameSummary>;
  address: string;
  city: string;
  country: string;
  postcode: string;
};

export type clubSummary = {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  members: Array<{
    id: string;
    role: "member" | "admin";
  }>;
  creator: {
    id: string;
    firstname: string;
    lastname: string;
    avatar: string;
    status: string;
  };
};

export function userIsInClub(user: any, club: clubType) {
  return club.members.map((m) => m.id).includes(user.id);
}
