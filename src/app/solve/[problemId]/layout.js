export const dynamic = "force-dynamic";

export default function SolveLayout({ children }) {
  return (
    <div className="absolute inset-0 top-[4.5rem] w-full flex flex-col p-2 overflow-hidden">
      {children}
    </div>
  );
}
