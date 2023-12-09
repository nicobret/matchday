import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClubs } from "./useClubs";

const CreateLeague = () => {
  const [name, setName] = useState("");
  const { createClub } = useClubs();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await createClub(name);
  }

  return (
    <div className="border my-6 rounded p-6 space-y-6">
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
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
};

export default CreateLeague;
