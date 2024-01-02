export default function Footer() {
  return (
    <footer className="flex justify-center mb-6 text-muted-foreground">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} -{" "}
        <a
          href="https://github.com/nicobret"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          nicobret
        </a>
      </p>
    </footer>
  );
}
