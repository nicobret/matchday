import { gameSummary } from "../games/games.service";

export type clubType = {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  members: Array<{
    id: string;
    role: "member" | "admin";
    profile: {
      id: string;
      firstname: string;
      lastname: string;
      avatar: string;
      status: string;
    };
  }>;
  creator: {
    id: string;
    firstname: string;
    lastname: string;
    avatar: string;
    status: string;
  };
  games: Array<gameSummary>;
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
