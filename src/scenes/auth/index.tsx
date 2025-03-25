import { Button, buttonVariants } from "@/components/ui/button";
import useAuth from "@/lib/useAuth";
import { useState } from "react";
import { Link } from "wouter";
import SigninForm from "./components/SigninForm";
import SignupForm from "./components/SignupForm";

export default function Auth() {
  const [displaySignup, setDisplaySignup] = useState(false);
  const { session, logout } = useAuth();

  return (
    <div className="mx-auto max-w-lg p-4">
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
      ) : displaySignup ? (
        <>
          <SignupForm />
          <br />
          <Button
            variant="outline"
            onClick={() => setDisplaySignup(!displaySignup)}
          >
            J'ai déjà un compte
          </Button>
        </>
      ) : (
        <>
          <SigninForm />
          <br />
          <Button
            variant="outline"
            onClick={() => setDisplaySignup(!displaySignup)}
          >
            Créer un compte
          </Button>
        </>
      )}
    </div>
  );
}
