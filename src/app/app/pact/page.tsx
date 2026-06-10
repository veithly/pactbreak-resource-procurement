import { AppShell } from "@/components/AppShell";
import { PactConsole } from "@/components/PactConsole";

export default function PactPage() {
  return (
    <AppShell>
      <div data-placeholder-example="submit-pact" />
      <div data-placeholder-example="poll-owner" />
      <div data-next-step-cta="execute-safe-transfer" />
      <PactConsole />
    </AppShell>
  );
}
