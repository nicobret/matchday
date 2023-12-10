import { useState } from "react";
import { Link } from "react-router-dom";
import { useClubs } from "./useClubs";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CreateLeague = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { createClub } = useClubs();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await createClub(name, description);
  }

  return (
    <div className="border rounded p-6 space-y-6">
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Link to="/clubs">
          <p>Clubs</p>
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="#">
          <p>Créer un club</p>
        </Link>
      </div>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Créer un club
      </h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="clubname">Nom du club</Label>
          <Input
            type="text"
            id="clubname"
            placeholder="Le club des champions"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="clubdescription">Description</Label>
          <Textarea
            id="clubdescription"
            placeholder="Le meilleur club de tous les temps."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button type="submit">Créer</Button>
      </form>
    </div>
  );
};

export default CreateLeague;
