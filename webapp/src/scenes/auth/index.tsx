import { Button, buttonVariants } from "@/components/ui/button";
import useAuth from "@/lib/auth/useAuth";
import { Link, Route, Switch } from "wouter";
import SigninForm from "./components/SigninForm";
import SignupForm from "./components/SignupForm";

export default function Auth() {
  const { session, logout } = useAuth();
  const redirectTo = new URLSearchParams(window.location.search).get(
    "redirectTo",
  );

  return (
    <div className="mx-auto mt-16 max-w-sm rounded border p-4">
      {session ? (
        <>
          <p>Vous êtes déjà connecté(e).</p>
          <br />
          <div className="flex gap-2">
            <Link to="/" className={buttonVariants()}>
              Retour à l'accueil
            </Link>
            <Button variant="outline" onClick={logout}>
              Se déconnecter
            </Button>
          </div>
        </>
      ) : (
        <Switch>
          <Route path="/auth/login">
            <SigninForm />
            <br />
            <Link
              to={`~/auth/signup?redirectTo=${redirectTo}`}
              className="text-muted-foreground text-center text-sm"
            >
              Créer un compte
            </Link>
          </Route>
          <Route path="/auth/signup">
            <SignupForm />
            <br />
            <Link
              to={`~/auth/login?redirectTo=${redirectTo}`}
              className="text-muted-foreground text-center text-sm"
            >
              J'ai déjà un compte
            </Link>
          </Route>
        </Switch>
      )}
    </div>
  );
}
