import supabase from "@/utils/supabase";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";

export default function Auth() {
  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get("redirectTo");

  return (
    <div className="mx-auto max-w-lg p-4">
      <SupabaseAuth
        supabaseClient={supabase}
        providers={[]}
        localization={{
          variables: {
            sign_in: {
              button_label: "Connexion",
              email_input_placeholder: "Votre email",
              password_input_placeholder: "Votre mot de passe",
              email_label: "Email",
              password_label: "Mot de passe",
              loading_button_label: "Chargement...",
              link_text: "Vous avez déjà un compte ? Se connecter",
            },
            sign_up: {
              button_label: "Inscription",
              email_input_placeholder: "Votre email",
              password_input_placeholder: "Votre mot de passe",
              email_label: "Email",
              password_label: "Mot de passe",
              loading_button_label: "Chargement...",
              link_text: "Vous n'avez pas de compte ? S'inscrire",
            },
            forgotten_password: {
              link_text: "Mot de passe oublié ?",
            },
          },
        }}
        redirectTo={redirectTo || "/"}
      />
    </div>
  );
}
