import { gamePlayer } from "../View";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Grip, Shirt } from "lucide-react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import supabaseClient from "@/utils/supabase";

export default function LineUp({
  players,
  setPlayers,
  disabled,
}: {
  players: gamePlayer[];
  setPlayers: any;
  disabled: boolean;
}) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex gap-3 items-center">
          <ClipboardList className="h-5 w-5" />
          Compositions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {disabled ? (
          <div className="text-center">
            <p>La composition ne peut pas être modifiée</p>
          </div>
        ) : (
          <EditLineUp players={players} setPlayers={setPlayers} />
        )}
      </CardContent>
    </Card>
  );
}

function EditLineUp({
  players,
  setPlayers,
}: {
  players: gamePlayer[];
  setPlayers: any;
}) {
  async function handleDrop(event: any) {
    const teams = {
      none: null,
      home: 0,
      away: 1,
    };
    const team = teams[event.over.id];
    const newArr = players.map((p) =>
      p.id === event.active.id ? { ...p, team } : p
    );
    setPlayers(newArr);
    const { error } = await supabaseClient
      .from("game_registrations")
      .update({ team })
      .eq("id", event.active.id);
    if (error) {
      console.error("Error updating player:", error.message);
      setPlayers(players);
    }
  }

  return (
    <DndContext onDragEnd={handleDrop}>
      <div className="grid grid-cols-3 gap-4">
        <Team
          label="Disponibles"
          id="none"
          players={players.filter((p) => p.team === null)}
        />
        <Team
          label={
            <>
              <span>Domicile</span>
              <Shirt className="h-5 w-5  text-yellow-300 inline-block ml-2" />
            </>
          }
          id="home"
          players={players.filter((p) => p.team === 0)}
        />
        <Team
          label={
            <>
              <span>Visiteurs</span>
              <Shirt className="h-5 w-5  text-red-400 inline-block ml-2" />
            </>
          }
          id="away"
          players={players.filter((p) => p.team === 1)}
        />
      </div>
    </DndContext>
  );
}

function Team({
  label,
  id,
  players,
}: {
  label: string | JSX.Element;
  id: String;
  players: gamePlayer[];
}) {
  const { isOver, setNodeRef } = useDroppable({ id: id as string });
  return (
    <div
      ref={setNodeRef}
      className={`border-dashed border-2 border-foreground rounded-lg p-2 text-center ${
        isOver ? "bg-accent" : "bg-card-background"
      }`}
    >
      <p>{label}</p>
      <div className="mt-2 grid gap-1">
        {players.map((p) => (
          <Draggable key={p.id} player={p} />
        ))}
      </div>
    </div>
  );
}

function Draggable({ player }: { player: gamePlayer }) {
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
      className="flex gap-2 items-center bg-foreground text-background rounded-lg p-1 text-left cursor-grab active:shadow-lg active:cursor-grabbing"
    >
      <Grip className="h-4 w-4" />
      {player.profile?.firstname}
    </div>
  );
}
