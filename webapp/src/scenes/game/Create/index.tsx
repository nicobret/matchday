import { parseAsInteger, useQueryState } from "nuqs";
import ClubSelector from "./components/ClubSelector";
import GameForm from "./components/GameForm";

export default function Create() {
  const [clubId, setClubId] = useQueryState("clubId", parseAsInteger);
  return (
    <div className="p-2">
      <h2 className="font-new-amsterdam mb-2 mt-6 scroll-m-20 text-center text-4xl">
        Créer un match
      </h2>

      <div className="bg-muted/30 mx-auto mt-8 max-w-lg rounded-lg border p-4">
        {clubId ? (
          <GameForm clubId={clubId} />
        ) : (
          <ClubSelector setClubId={setClubId} />
        )}
      </div>
    </div>
  );
}
