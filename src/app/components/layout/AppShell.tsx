import { BottomNav } from "./BottomNav";

type AppShellProps = {
  children: React.ReactNode;
  showBottomNav?: boolean;
};

export function AppShell({
  children,
  showBottomNav = true,
}: AppShellProps) {
  return (
    <main className="min-h-screen bg-[#F7FAFC] text-[#062B55]">
      <div className="mx-auto max-w-md px-4 pb-28">
        {children}
      </div>

      {showBottomNav ? (
        <BottomNav />
      ) : null}
    </main>
  );
}