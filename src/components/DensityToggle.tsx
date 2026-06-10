"use client";

import { Rows3 } from "lucide-react";

export function DensityToggle() {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--muted)" }}>
      <Rows3 size={17} aria-hidden />
      <select
        aria-label="Density"
        defaultValue="comfortable"
        onChange={(event) => {
          document.documentElement.dataset.density = event.target.value;
        }}
        style={{
          minHeight: 44,
          borderRadius: 8,
          border: "1px solid var(--line)",
          background: "oklch(0.16 0.017 238)",
          color: "var(--ink)",
          padding: "0 10px"
        }}
      >
        <option value="compact">Compact</option>
        <option value="comfortable">Comfortable</option>
      </select>
    </label>
  );
}
