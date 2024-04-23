export default function Footer() {
  return (
    <footer className="flex justify-center p-6 bg-muted text-muted-foreground">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} -{" "}
        <a
          href="https://github.com/nicobret"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2"
        >
          nicobret
        </a>
      </p>
    </footer>
  );
}
