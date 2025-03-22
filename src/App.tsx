import { QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Redirect, Route, Switch } from "wouter";
import { SessionProvider } from "./components/auth-provider.tsx";
import Layout from "./components/Layout.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./index.css";
import { queryClient } from "./lib/react-query.ts";
import useProfile from "./scenes/home/useProfile.ts";

const Account = lazy(() => import("./scenes/account"));
const Club = lazy(() => import("./scenes/club/Club.tsx"));
const Game = lazy(() => import("./scenes/game/Game.tsx"));
const Home = lazy(() => import("./scenes/home"));
const Player = lazy(() => import("./scenes/player"));
const Auth = lazy(() => import("./scenes/auth"));

export default function App() {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <ErrorBoundary FallbackComponent={Fallback}>
              <Layout>
                <Suspense fallback={<AppLoader />}>
                  <RedirectIfProfileNotComplete />
                  <Switch>
                    <Route path="/auth" component={Auth} />
                    <Route path="/account" component={Account} />
                    <Route path="/club/:id" component={Club} nest />
                    <Route path="/game" component={Game} nest />
                    <Route path="/player/:id" component={Player} />
                    <Route path="/" component={Home} />
                    <Route component={NotFound} />
                  </Switch>
                </Suspense>
              </Layout>
            </ErrorBoundary>
          </SessionProvider>
        </QueryClientProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
}

function NotFound() {
  return <div className="text-center">404 - Page non trouvée</div>;
}

function AppLoader() {
  return (
    <div className="animate-pulse text-center">
      Chargement de l'application...
    </div>
  );
}

function Fallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert">
      <p>Une erreur est survenue:</p>
      <pre>{error.message}</pre>
      <pre>{JSON.stringify(error)}</pre>
      <button onClick={resetErrorBoundary}>Réessayer</button>
    </div>
  );
}

function RedirectIfProfileNotComplete() {
  const { data: profile } = useProfile();
  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get("redirectTo");
  const url = redirectTo ? `/account?redirectTo=${redirectTo}` : "/account";

  if (profile && !profile?.firstname) {
    return <Redirect to={url} />;
  }
  return null;
}
