import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import supabase from "@/utils/supabase";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";

type SigninFormValues = {
  email: string;
  password: string;
};

export default function SigninForm() {
  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get("redirectTo");
  const { handleSubmit, register } = useForm<SigninFormValues>();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const url = redirectTo ? `~/${redirectTo}` : "~/";

  async function onSubmit(data: SigninFormValues) {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    navigate(url);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="mb-4 text-2xl font-semibold">Connexion</h2>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input {...register("email")} type="email" required />
      </div>
      <br />
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input {...register("password")} type="password" required />
      </div>
      <br />
      <Button type="submit">Valider</Button>
    </form>
  );
}
