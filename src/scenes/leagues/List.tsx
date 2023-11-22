import { Link, useLoaderData } from "react-router-dom";
import useStore from "../../utils/zustand";
import LeagueCard from "./components/LeagueCard";

export default function List() {
  const { leagues } = useLoaderData() as {
    leagues: Array<{
      id: number;
      name: string;
      league_memberships: Array<{ user_id: string }>;
    }> | null;
  };

  const { session } = useStore();

  if (!session || !leagues)
    return <p className="text-center animate-pulse">Chargement...</p>;

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Mes ligues
      </h2>
      <div className="grid grid-cols-4">
        {leagues
          .filter((l) =>
            l.league_memberships.some((m) => m.user_id === session.user.id)
          )
          .map((league) => (
            <LeagueCard key={league.id} {...league} />
          ))}
      </div>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Rejoindre une ligue
      </h2>
      <div className="grid grid-cols-4">
        {leagues
          .filter(
            (l) =>
              !l.league_memberships.some((m) => m.user_id === session.user.id)
          )
          .map((league) => (
            <LeagueCard key={league.id} {...league} />
          ))}
      </div>

      {session && (
        <Link
          to="/leagues/create"
          className="underline underline-offset-2 hover:text-gray-500"
        >
          Créer une ligue
        </Link>
      )}
    </>
  );
}
