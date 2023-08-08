const { chromium } = require("playwright");
const fs = require("fs");

const DEFAULT_TIMEOUT = 3000;

async function main() {
  const browser = await chromium.launch({
    headless: false,
  });

  const page = await browser.newPage();

  // Opening the VK login page
  await page.goto("https://vk.com/");
  await page.locator('[placeholder="Phone or email"]').click();
  await page.locator('[placeholder="Phone or email"]').fill("number"); // number
  await page.keyboard.press("Enter");
  await page.waitForTimeout(DEFAULT_TIMEOUT);

  await page.locator('[placeholder="Enter password"]').click(); 
  await page.locator('[placeholder="Enter password"]').fill("password"); // password
  await page.locator('button:has-text("Continue")').click();
  await page.waitForTimeout(DEFAULT_TIMEOUT);

  // Navigating to the music page
  await page.goto("link"); // songs link
  await page.waitForTimeout(DEFAULT_TIMEOUT);

  // Scrolling to the bottom of the page
  const scrollDistance = 1000; // Adjust as needed
  const maxScrollAttempts = 100; // Adjust as needed

  for (let i = 0; i < maxScrollAttempts; i++) {
    await page.evaluate((scrollDistance) => {
      window.scrollBy(0, scrollDistance);
    }, scrollDistance);
    await page.waitForTimeout(100); // Adjust the timeout if needed
  }

  // Scrape the music data
  const songs = await page.evaluate(() => {
    const songsData = [];
    const songElements = document.querySelectorAll(
      ".CatalogBlock__itemsContainer .audio_row_playable"
    );

    let id = 1; // Initialize the ID counter

    for (const songElement of songElements) {
      const artist = songElement.querySelector(
        ".audio_row__performers a"
      ).textContent;
      const song = songElement.querySelector(
        ".audio_row__title_inner"
      ).textContent;
      const duration = songElement.querySelector(
        ".audio_row__duration"
      ).textContent;

      songsData.push({ id, artist, song, duration });
      id++;
    }

    return songsData;
  });

  // Write scraped data to JSON file
  fs.writeFileSync("songs.json", JSON.stringify(songs, null, 2));

  await browser.close();
}

main();
