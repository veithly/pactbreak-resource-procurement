import { AppShell } from "@/components/AppShell";
import { TreasuryConsole } from "@/components/TreasuryConsole";

export default function QueuePage() {
  return (
    <AppShell>
      <div data-placeholder-example="procurement-quote" />
      <div data-placeholder-example="procurement-proof" />
      <div data-next-step-cta="mutate-order" />
      <TreasuryConsole />
    </AppShell>
  );
}
