import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/lib/auth/useAuth";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";

type SigninFormValues = { email: string; password: string };

export default function SigninForm() {
  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get("redirectTo");
  const { handleSubmit, register } = useForm<SigninFormValues>();
  const [, navigate] = useLocation();
  const url = redirectTo ? `~/${redirectTo}` : "~/";
  const { login } = useAuth();

  function onSubmit(payload: SigninFormValues) {
    login(payload, { onSuccess: () => navigate(url) });
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
      <Button type="submit" className="w-full">
        Me connecter
      </Button>
    </form>
  );
}
