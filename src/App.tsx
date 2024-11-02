import { Suspense, lazy } from "react";
import { QueryClientProvider } from "react-query";
import { Route, Switch } from "wouter";
import { SessionProvider } from "./components/auth-provider.tsx";
import Layout from "./components/Layout.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./index.css";
import { queryClient } from "./lib/react-query.ts";

const Account = lazy(() => import("./scenes/account"));
const Club = lazy(() => import("./scenes/club/Club.tsx"));
const Game = lazy(() => import("./scenes/game/Game..tsx"));
const Home = lazy(() => import("./scenes/home"));
const Player = lazy(() => import("./scenes/player"));
const Auth = lazy(() => import("./scenes/auth"));

export default function App() {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <Layout>
            <Suspense fallback={<Fallback />}>
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
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function NotFound() {
  return <div className="text-center">404 - Page non trouvée</div>;
}

function Fallback() {
  return (
    <div className="animate-pulse text-center">
      Chargement de l'application...
    </div>
  );
}
