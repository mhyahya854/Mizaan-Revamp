import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_IMPORT_PATH ?? "playwright");

const rootUrl = process.env.MIZAAN_QA_URL ?? "http://127.0.0.1:4175";
const screenshotDir = "E:/Github/Mizaan-Revamp/docs/screenshots";
const prefix = process.env.MIZAAN_QA_PREFIX ?? "20260529-1700-phase-4-5";
const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";

await mkdir(screenshotDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--disable-gpu", "--no-first-run"],
});
const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
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
  await page.waitForTimeout(450);
}

async function chooseTemplate(name) {
  const matches = page.locator("button", { hasText: name });
  const count = await matches.count();
  if (count < 1) throw new Error(`No template found for ${name}`);
  await matches.nth(count - 1).click();
  await page.waitForURL("**/page/**", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(450);
}

async function clickButtonText(text) {
  const matches = page.locator("button", { hasText: text });
  const count = await matches.count();
  if (count < 1) throw new Error(`No button found for ${text}`);
  await matches.first().click();
}

await openPath("/");
await capture("home");
steps.push("Opened Home.");

await capture("sidebar-after");
steps.push("Confirmed sidebar zones are visible on Home.");

await page.keyboard.press("Control+K");
await page.waitForTimeout(250);
if (!(await page.getByPlaceholder("Search pages or run page commands").isVisible())) {
  throw new Error("Command palette did not open from Ctrl+K.");
}
await page.keyboard.press("Escape");
steps.push("Opened and closed the command palette.");

await clickButtonText("New note");
await page.waitForTimeout(250);
await capture("template-picker");
await chooseTemplate("Lecture Notes");
await capture("page-workspace");
const qaNoteUrl = page.url();
steps.push("Created a note through the template picker and opened the page workspace.");

await page.locator('input[placeholder="Untitled"]').fill("Phase 4-5 QA Lecture Note");
await page
  .locator('textarea[placeholder="Type / for commands"]')
  .first()
  .fill("Phase 4-5 edited block.");
steps.push("Edited title and first block.");

await page.getByText("Add a block", { exact: false }).click();
await page.waitForTimeout(250);
await capture("slash-menu");
await clickButtonText("Simple Table");
await page.waitForTimeout(250);
await capture("simple-table-editor");
steps.push("Opened slash command menu and inserted a simple table block.");

await page.locator('input[aria-label="Rename Column 1"]').fill("Topic");
await page.locator('textarea[placeholder="Empty"]').first().fill("Persistence");
await page.getByRole("button", { name: "Add column" }).click();
await clickButtonText("New row");
await page.waitForTimeout(250);
await page.getByRole("button", { name: "Remove Column 2" }).click();
await page.waitForTimeout(250);
steps.push("Edited simple table cells and added/removed table rows and columns.");

await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(450);
const titleValue = await page.locator('input[placeholder="Untitled"]').inputValue();
const tableCellValue = await page.locator('textarea[placeholder="Empty"]').first().inputValue();
if (titleValue !== "Phase 4-5 QA Lecture Note") {
  throw new Error(`Title did not persist after refresh: ${titleValue}`);
}
if (tableCellValue !== "Persistence") {
  throw new Error(`Table cell did not persist after refresh: ${tableCellValue}`);
}
await page.getByRole("button", { name: "Remove row" }).last().click();
await page.waitForTimeout(250);
steps.push("Refreshed and confirmed page title, block, and simple table persistence.");

await clickButtonText("Properties");
await capture("page-right-panel");
steps.push("Opened the right panel properties tab.");

await openPath("/databases");
await capture("databases-route");
await clickButtonText("New database");
await page.waitForTimeout(250);
await chooseTemplate("Basic Database");
await capture("database-editor");
steps.push("Created a database page from the Basic Database template.");

await page.getByRole("button", { name: "Property", exact: true }).click();
await page.locator('input[aria-label="Rename New property"]').fill("Priority");
await clickButtonText("New row");
await page.locator('input[placeholder="Empty"]').first().fill("Database persistence");
await page.waitForTimeout(250);
await page.getByRole("button", { name: "Open row as page" }).first().click();
await page.waitForURL("**/page/**", { waitUntil: "domcontentloaded" });
steps.push("Added database property/row, edited a cell, and opened a row as a page.");

await page.goBack({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(450);
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(450);
const databaseCellValue = await page.locator('input[placeholder="Empty"]').first().inputValue();
if (databaseCellValue !== "Database persistence") {
  throw new Error(`Database cell did not persist after refresh: ${databaseCellValue}`);
}
await page.getByRole("button", { name: "Remove row" }).last().click();
await page.getByRole("button", { name: "Remove Priority" }).click();
await page.waitForTimeout(250);
steps.push("Refreshed and confirmed database table persistence.");

await openPath("/search");
steps.push("Opened Search route.");

await openPath("/documents");
await clickButtonText("New document");
await page.waitForTimeout(250);
await chooseTemplate("Document Record");
steps.push("Created/opened a document record through the template picker.");

await openPath("/projects");
await clickButtonText("New project");
await page.waitForTimeout(250);
await chooseTemplate("Project Plan");
steps.push("Created/opened a project page through the template picker.");

await openPath("/people");
await clickButtonText("New person");
await page.waitForTimeout(250);
await chooseTemplate("Person Profile");
steps.push("Created/opened a person profile through the template picker.");

await openPath("/finance");
await clickButtonText("New finance record");
await page.waitForTimeout(250);
await chooseTemplate("Finance Record");
steps.push("Created/opened a finance record through the template picker.");

await openPath("/calendar");
await clickButtonText("New event");
await page.waitForTimeout(250);
await chooseTemplate("Calendar Event");
steps.push("Created/opened a calendar event through the template picker.");

await openPath("/trackers");
await clickButtonText("New tracker");
await page.waitForTimeout(250);
await chooseTemplate("Tracker");
steps.push("Created/opened a tracker through the template picker.");

await page.goto(qaNoteUrl, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(450);
await clickButtonText("Relations");
const relationButtons = await page.locator("button", { hasText: "Project Plan" }).count();
if (relationButtons > 0) {
  await page.locator("button", { hasText: "Project Plan" }).first().click();
  await page.waitForTimeout(250);
  await clickButtonText("Remove");
}
await clickButtonText("Child page");
await page.waitForTimeout(250);
await chooseTemplate("Blank Page");
steps.push("Added/removed a relation and created a child page through the template picker.");

await openPath("/vault");
await capture("vault-still-working");
steps.push("Opened Vault.");

await openPath("/settings");
await capture("settings-vault-link");
steps.push("Opened Settings.");

await openPath("/graph");
steps.push("Opened Graph.");

await openPath("/page/note-principles");
await page.getByRole("button", { name: "Archive" }).click();
await page.waitForTimeout(250);
await openPath("/trash");
await page.getByRole("button", { name: "Restore" }).first().click();
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
