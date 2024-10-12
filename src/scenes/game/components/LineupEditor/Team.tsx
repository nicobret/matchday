import { useDroppable } from "@dnd-kit/core";
import { Player as PlayerType } from "../../lib/player.service";
import Player from "./Player";

export default function Team({
  label,
  id,
  icon,
  players,
}: {
  label: string;
  id: string;
  icon?: JSX.Element;
  players: PlayerType[];
}) {
  const { isOver, setNodeRef } = useDroppable({ id: id as string });
  return (
    <div
      ref={setNodeRef}
      className={`bg-card-background min-h-24 rounded-lg border-2 border-dashed p-3 ${
        isOver ? "border-primary" : "border-input"
      }`}
    >
      <div className="flex items-start justify-between">
        <p>{label}</p>
        {icon}
      </div>
      <div className="mt-2 grid gap-1">
        {players.map((p) => (
          <Player key={p.id} player={p} />
        ))}
      </div>
    </div>
  );
}
