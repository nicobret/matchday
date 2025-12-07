import useClubStats from "@/lib/club/useClubStats";
import EventStats from "./EventStats";
import WinStats from "./WinStats";

export default function ClubStats({ clubId }: { clubId: number }) {
  const { data, isError, isPending } = useClubStats(clubId);

  if (isPending) {
    return <div>Chargement...</div>;
  }
  if (isError) {
    return <div>Erreur</div>;
  }
  return (
    <div className="grid gap-8 pb-4 pt-2">
      <WinStats data={data} />
      <EventStats data={data} />
    </div>
  );
}
