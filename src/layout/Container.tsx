export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="shadow-sm md:rounded-lg p-4 md:p-10 bg-white">
      {children}
    </div>
  );
}
