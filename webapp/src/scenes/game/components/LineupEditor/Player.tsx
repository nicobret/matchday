import { Player as PlayerType } from "@/lib/player/player.service";
import { useDraggable } from "@dnd-kit/core";
import { Grip } from "lucide-react";

export default function Player({ player }: { player: PlayerType }) {
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
      className="bg-muted flex cursor-grab touch-none items-center gap-2 rounded-lg p-2 text-left active:cursor-grabbing active:shadow-lg"
    >
      <Grip className="h-4 w-4" />
      {player.name || player.profile?.firstname}
    </div>
  );
}
