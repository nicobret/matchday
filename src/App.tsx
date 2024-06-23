import "./index.css";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { SessionProvider } from "./components/auth-provider.tsx";
import Layout from "./components/Layout.tsx";

const Account = lazy(() => import("./scenes/account"));
const Club = lazy(() => import("./scenes/club"));
const Game = lazy(() => import("./scenes/game"));
const Home = lazy(() => import("./scenes/home"));
const Player = lazy(() => import("./scenes/player"));

export default function App() {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <SessionProvider>
        <BrowserRouter>
          <Layout>
            <Suspense fallback={<Fallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="account" element={<Account />} />
                <Route path="club/*" element={<Club />} />
                <Route path="game/*" element={<Game />} />
                <Route path="player/:id" element={<Player />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </SessionProvider>
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
