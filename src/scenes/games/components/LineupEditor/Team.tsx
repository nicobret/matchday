import { useDroppable } from "@dnd-kit/core";
import { gamePlayer } from "../../View";
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
  players: gamePlayer[];
}) {
  const { isOver, setNodeRef } = useDroppable({ id: id as string });
  return (
    <div
      ref={setNodeRef}
      className={`border-dashed border-2 bg-card-background rounded-lg p-3 min-h-24 ${
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
