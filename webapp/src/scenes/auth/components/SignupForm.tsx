import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import supabase from "@/utils/supabase";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLocation } from "wouter";

type SignupFormValues = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export default function SignupForm() {
  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get("redirectTo");
  const { handleSubmit, register, watch } = useForm<SignupFormValues>();
  const [_, navigate] = useLocation();
  const url = redirectTo ? `~/${redirectTo}` : "~/";

  async function onSubmit(data: SignupFormValues) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      // options: {
      //   data: {
      //     firstname: "John",
      //     lastname: "Doe",
      //   },
      // },
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate(url);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="mb-4 text-2xl font-semibold">Inscription</h2>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input {...register("email")} type="email" required />
      </div>
      <br />
      <div className="grid gap-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input {...register("password")} type="password" required />
      </div>
      <br />
      <div className="grid gap-2">
        <Label htmlFor="password-confirm">Confirmation du mot de passe</Label>
        <Input
          {...register("passwordConfirm", {
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
          type="password"
          required
        />
      </div>
      <br />
      <Button type="submit" className="w-full">
        Créer mon compte
      </Button>
    </form>
  );
}
