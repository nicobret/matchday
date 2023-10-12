import { Link, useLoaderData } from "react-router-dom";
import supabaseClient from "../../utils/supabase";
import useStore from "../../utils/zustand";

export default function List() {
  const { leagues, memberships } = useLoaderData() as {
    leagues: Array<{ id: number; name: string }> | null;
    memberships: Array<{
      id: number;
      league_id: number;
      status: string;
    }> | null;
  };

  const { session } = useStore();

  async function join(leagueId: number) {
    const { data, error } = await supabaseClient
      .from("league_memberships")
      .insert({ league_id: leagueId })
      .select();
    if (error) {
      console.error(error);
    }
    console.log("🚀 ~ file: List.tsx:22 ~ join ~ data", data);
  }

  async function leave(leagueId: number) {
    if (window.confirm("Voulez-vous vraiment quitter cette ligue ?")) {
      const { data, error } = await supabaseClient
        .from("league_memberships")
        .delete()
        .eq("league_id", leagueId)
        .select();
      if (error) {
        console.error(error);
      }
      console.log("🚀 ~ file: List.tsx:22 ~ join ~ data", data);
    }
  }

  return (
    <>
      {session && leagues && memberships && (
        <>
          <h2>Mes ligues</h2>
          <ul>
            {leagues
              .filter((league) =>
                memberships.some((m) => m.league_id === league.id)
              )
              .map((league) => (
                <li key={league.id}>
                  {league.name}
                  <button onClick={() => leave(league.id)}>Quitter</button>
                </li>
              ))}
          </ul>
        </>
      )}

      <h2>Rejoindre une ligue</h2>
      <ul>
        {leagues?.length &&
          leagues
            .filter(
              (league) => !memberships?.some((m) => m.league_id === league.id)
            )
            .map((league) => (
              <li key={league.id}>
                {league.name}
                {session && (
                  <button onClick={() => join(league.id)}>Rejoindre</button>
                )}
              </li>
            ))}
      </ul>

      {session && <Link to="/leagues/create">Créer une ligue</Link>}
    </>
  );
}
