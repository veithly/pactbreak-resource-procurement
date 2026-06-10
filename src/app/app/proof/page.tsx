import { AppShell } from "@/components/AppShell";
import { ProofBoard } from "@/components/ProofBoard";

export default function ProofPage() {
  return (
    <AppShell>
      <div data-placeholder-example="import-caw-evidence" />
      <div data-placeholder-example="sync-audit" />
      <div data-next-step-cta="open-full-run" />
      <ProofBoard />
    </AppShell>
  );
}
