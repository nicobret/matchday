import useClubStats from "../lib/club/useClubStats";
import EventStats from "./EventStats";
import WinStats from "./WinStats";

export default function ClubStats({ clubId }: { clubId: number }) {
  const { data, isError, isLoading, isIdle } = useClubStats(clubId);

  if (isIdle) {
    return <div>Selectionnez un club</div>;
  }
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  if (isError) {
    return <div>Erreur</div>;
  }
  return (
    <div className="mt-4 grid gap-8 md:grid-cols-2">
      <WinStats data={data} />
      <EventStats data={data} />
    </div>
  );
}
