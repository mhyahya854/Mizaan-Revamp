import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("root theme hydration", () => {
  it("suppresses the expected html attribute mismatch from the pre-hydration theme script", () => {
    const rootRoute = readFileSync("src/routes/__root.tsx", "utf8");

    expect(rootRoute).toContain('<html lang="en" suppressHydrationWarning>');
  });
});
