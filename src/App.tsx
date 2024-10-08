import ScrollToHashElement from "@cascadia-code/scroll-to-hash-element";
import { Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { SessionProvider } from "./components/auth-provider.tsx";
import Layout from "./components/Layout.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./index.css";

const Account = lazy(() => import("./scenes/account"));
const Club = lazy(() => import("./scenes/club"));
const Game = lazy(() => import("./scenes/game"));
const Home = lazy(() => import("./scenes/home"));
const Player = lazy(() => import("./scenes/player"));
const Auth = lazy(() => import("./scenes/auth"));

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SessionProvider>
            <Layout>
              <ScrollToTop />
              <ScrollToHashElement />
              <Suspense fallback={<Fallback />}>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/club/*" element={<Club />} />
                  <Route path="/game/*" element={<Game />} />
                  <Route path="/player/:id" element={<Player />} />
                  <Route path="/" element={<Home />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
          </SessionProvider>
        </BrowserRouter>
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
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
