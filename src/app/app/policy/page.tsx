import { AppShell } from "@/components/AppShell";
import { PolicyLab } from "@/components/PolicyLab";

export default function PolicyPage() {
  return (
    <AppShell>
      <div data-placeholder-example="safe-policy" />
      <div data-placeholder-example="blocked-policy" />
      <div data-next-step-cta="try-blocked-policy" />
      <PolicyLab />
    </AppShell>
  );
}
