import { rename } from "fs";
import path from "path";
import puppeteer, { Page } from "puppeteer";
import userAgent from "user-agents";
// Function to download CSV
export const downloadFpsCsvs = async () => {
  console.log("Starting CSV download process...");
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setUserAgent(userAgent.random().toString());

  const client = await page.target().createCDPSession();

  // Set the download behavior
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: path.resolve("./src/csv/fps"),
  });

  const loginUrl = "https://www.fantasypros.com/accounts/signin/";
  const usernameSelector = "#username";
  const passwordSelector = "#password";

  const username = process.env.FANTASYPROS_USERNAME;
  const password = process.env.FANTASYPROS_PASSWORD;

  // Login to FantasyPros
  console.log("Logging in to FantasyPros");
  await page.goto(loginUrl, { waitUntil: "networkidle2" });
  await page.type(usernameSelector, username);
  await page.type(passwordSelector, password);

  // Click the submit button
  console.log("Submitting login form");
  await page.evaluate(() => {
    // @ts-ignore
    document.querySelector(".launchpad__form-submit-button").click();
  });
  // Wait to get credentials
  await page.waitForTimeout(3000);

  // Load Page with CSV Download
  console.log("Loading page with CSV download");
  const targetPageUrl =
    "https://www.fantasypros.com/nfl/rankings/half-point-ppr-cheatsheets.php?signedin&signedin";
  await page.goto(targetPageUrl, { waitUntil: "networkidle2" });
  await page.waitForTimeout(1000);

  // OverView Flow
  console.log("Starting Overview flow");
  await clickAndDownload(page, 3, "FantasyPros_Draft_Overview");
  // Ranks Flow
  console.log("Starting Ranks flow");
  await clickAndDownload(page, 4, "FantasyPros_Draft_Ranks");
  // Notes Flow
  console.log("Starting Notes flow");
  await clickAndDownload(page, 5, "FantasyPros_Draft_Notes");
  // Total Stats Flow
  console.log("Starting Total Stats flow");
  await clickAndDownload(page, 6, "FantasyPros_Draft_Total_Stats");
  // Average Stats Flow
  console.log("Starting Average Stats flow");
  await clickAndDownload(page, 7, "FantasyPros_Draft_Average_Stats");

  console.log("Closing browser");
  await page.waitForTimeout(10000);
  await browser.close();
};

// Function to rename downloaded file
const renameDownloadedFile = async (originalName: string, newName: string) => {
  console.log(`Renaming file from ${originalName} to ${newName}`);
  const downloadPath = path.resolve("src/csv/fps");
  const originalFilePath = path.join(downloadPath, originalName);
  const newFilePath = path.join(downloadPath, newName);

  // Rename the file
  rename(originalFilePath, newFilePath, (err) => {
    if (err) throw err;
  });
};

// Function to click a button and download a file
const clickAndDownload = async (page: Page, index: number, name: string) => {
  console.log(`Clicking button and downloading file: ${name}`);
  await page.waitForTimeout(1000);
  await page.evaluate((index) => {
    const buttons = document.querySelectorAll(
      "li.select-advanced__item > button.select-advanced-content--button"
    );
    // @ts-ignore
    buttons[index].click();
  }, index);
  await page.waitForTimeout(1000);
  await page.click(`[aria-label="Download CSV file"]`);
  await page.waitForTimeout(2000);

  // Rename the downloaded file
  renameDownloadedFile(
    "FantasyPros_2023_Draft_ALL_Rankings.csv",
    name + ".csv"
  );
};
