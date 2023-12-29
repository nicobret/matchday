export type playerSummary = {
  id: string;
  role: "member" | "admin";
  created_at: Date;
  profile: {
    id: string;
    firstname: string;
    lastname: string;
    avatar: string;
    status: string;
  };
};
