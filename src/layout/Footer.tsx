export default function Footer() {
  return (
    <footer className="flex justify-center py-4 text-gray-500">
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
