import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="max-w-screen-xl mx-auto mb-20 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
