import { describe, expect, it } from "vitest";

import { getAppHeadLinks } from "./app-head";

describe("app head product law", () => {
  it(``, async () => {
    const links = getAppHeadLinks("/assets/app.css");
    const hrefs = links.flatMap((link) => (typeof link.href === "string" ? [link.href] : []));

    expect(hrefs).toContain("/assets/app.css");
    expect(hrefs.filter((href) => /^https?:\/\//i.test(href))).toEqual([]);
    expect(hrefs.join("\n").toLowerCase()).not.toMatch(/google|gstatic|fonts\.googleapis/);
  });
});
