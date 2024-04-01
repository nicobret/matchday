import { useDraggable } from "@dnd-kit/core";
import { gamePlayer } from "../../View";
import { Grip } from "lucide-react";

export default function Player({ player }: { player: gamePlayer }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: player.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex gap-2 items-center bg-muted rounded-lg p-2 text-left cursor-grab active:shadow-lg active:cursor-grabbing touch-none"
    >
      <Grip className="h-4 w-4" />
      {player.profile?.firstname}
    </div>
  );
}
