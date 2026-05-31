import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_IMPORT_PATH ?? "playwright");

const rootUrl = "http://127.0.0.1:4175";
const screenshotDir = "E:/Github/Mizaan-Revamp/docs/screenshots";
const prefix = "20260529-0705-phase-4";
const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";

await mkdir(screenshotDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--disable-gpu", "--no-first-run"],
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
const consoleErrors = [];

page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => {
  consoleErrors.push(error.message);
});

const screenshots = [];
const steps = [];

async function capture(name) {
  const filePath = path.join(screenshotDir, `${prefix}-${name}.png`);
  await page.screenshot({ path: filePath, fullPage: false });
  screenshots.push(filePath);
}

async function openPath(route) {
  await page.goto(`${rootUrl}${route}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(350);
}

await openPath("/");
await capture("home");
steps.push("Opened Home.");

await openPath("/notes");
await capture("notes-space");
steps.push("Opened Notes space.");

await page.locator("button", { hasText: "Lecture Notes" }).click();
await page.waitForURL("**/page/**", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(350);
await capture("page-workspace");
steps.push("Created a note from the Lecture Notes template.");

await page.locator('input[placeholder="Untitled"]').fill("Phase 4 QA Lecture Note");
await page
  .locator('textarea[placeholder="Type / for commands"]')
  .first()
  .fill("Browser QA edited this persisted block.");
steps.push("Edited title and first block.");

await page.getByText("Add a block", { exact: false }).click();
await page.waitForTimeout(250);
await capture("slash-menu");
await page.locator("button", { hasText: "Heading 2" }).click();
steps.push("Opened slash command menu and inserted Heading 2.");

await page.locator("button", { hasText: "Relations" }).click();
await page.waitForTimeout(250);
const relationTarget = page.locator("button", { hasText: "Mizaan Revamp" });
if ((await relationTarget.count()) === 1) {
  await relationTarget.click();
  await page.waitForTimeout(250);
}
await capture("page-right-panel-relations");
await page.locator("button", { hasText: "Outgoing" }).click();
await page.waitForTimeout(250);
await capture("relation-outgoing-section");
steps.push("Opened relation and outgoing right panel sections.");

await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(350);
const titleValue = await page.locator('input[placeholder="Untitled"]').inputValue();
const blockValue = await page
  .locator('textarea[placeholder="Type / for commands"]')
  .first()
  .inputValue();
if (titleValue !== "Phase 4 QA Lecture Note") {
  throw new Error(`Title did not persist after refresh: ${titleValue}`);
}
if (!blockValue.includes("Browser QA edited")) {
  throw new Error("Edited block did not persist after refresh.");
}
steps.push("Refreshed and confirmed title/block persistence.");

await openPath("/documents");
await page.locator("button", { hasText: "New document" }).click();
await page.waitForURL("**/page/**", { waitUntil: "domcontentloaded" });
steps.push("Created/opened a document record.");

await openPath("/projects");
await page.locator("button", { hasText: "New project" }).click();
await page.waitForURL("**/page/**", { waitUntil: "domcontentloaded" });
steps.push("Created/opened a project page.");

await openPath("/people");
await page.locator("button", { hasText: "New person" }).click();
await page.waitForURL("**/page/**", { waitUntil: "domcontentloaded" });
steps.push("Created/opened a person profile.");

await openPath("/vault");
await capture("vault-still-working");
steps.push("Opened Vault.");

await openPath("/settings");
await capture("settings-vault-link");
steps.push("Opened Settings.");

await openPath("/graph");
steps.push("Opened Graph.");

await openPath("/page/note-principles");
await page.locator("button", { hasText: "Archive" }).click();
await page.waitForTimeout(250);
await openPath("/trash");
await page.locator("button", { hasText: "Restore" }).first().click();
await page.waitForTimeout(250);
steps.push("Archived and restored an item through Trash.");

await writeFile(
  path.join(screenshotDir, `${prefix}-browser-qa.json`),
  JSON.stringify({ steps, screenshots, consoleErrors }, null, 2),
);

await browser.close();

if (consoleErrors.length > 0) {
  throw new Error(`Browser QA saw console errors: ${consoleErrors.join(" | ")}`);
}

console.log(
  JSON.stringify(
    {
      stepsCompleted: steps.length,
      screenshots,
      consoleErrors,
    },
    null,
    2,
  ),
);
