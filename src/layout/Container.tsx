export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="shadow-sm md:rounded p-4 md:p-8 bg-white">{children}</div>
  );
}
