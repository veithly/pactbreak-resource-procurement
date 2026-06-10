import { Sidebar } from "@/components/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-grid" data-visual-lane="operational-dashboard" data-hero-composition="treasury-command-table">
      <Sidebar />
      <main className="app-main">{children}</main>
    </div>
  );
}
