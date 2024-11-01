import { Suspense, lazy, useEffect } from "react";
import { QueryClientProvider } from "react-query";
// import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Route, Switch, useLocation } from "wouter";
import { SessionProvider } from "./components/auth-provider.tsx";
import Layout from "./components/Layout.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./index.css";
import { queryClient } from "./lib/react-query.ts";
import EditClub from "./scenes/club/Edit";
import ViewClub from "./scenes/club/View.tsx";
import CreateGame from "./scenes/game/Create.tsx";
import EditGame from "./scenes/game/Edit.tsx";
import ViewGame from "./scenes/game/View.tsx";

const Account = lazy(() => import("./scenes/account"));
// const Club = lazy(() => import("./scenes/club"));
// const Game = lazy(() => import("./scenes/game"));
const Home = lazy(() => import("./scenes/home"));
const Player = lazy(() => import("./scenes/player"));
const Auth = lazy(() => import("./scenes/auth"));

export default function App() {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <Layout>
            {/* <ScrollToTop /> */}
            <Suspense fallback={<Fallback />}>
              <Switch>
                <Route path="/auth" component={Auth} />
                <Route path="/account" component={Account} />
                <Route path="/club/:id/" component={ViewClub} />
                <Route path="/club/:id/edit" component={EditClub} />
                <Route path="/game/:id" component={ViewGame} />
                <Route path="/game/:id/edit" component={EditGame} />
                <Route path="/game/create" component={CreateGame} />
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

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}
