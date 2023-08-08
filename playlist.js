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
  await page.locator('[placeholder="Phone or email"]').fill("number"); // phone number
  await page.keyboard.press("Enter");
  await page.waitForTimeout(DEFAULT_TIMEOUT);

  await page.locator('[placeholder="Enter password"]').click();
  await page.locator('[placeholder="Enter password"]').fill("password"); // password
  await page.locator('button:has-text("Continue")').click();
  await page.waitForTimeout(DEFAULT_TIMEOUT);

  // Navigating to the music page
  await page.goto("link");  // playlist link
  await page.waitForTimeout(DEFAULT_TIMEOUT);

// Scrape the playlist songs data
const playlistSongs = await page.evaluate(() => {
    const songsData = [];
    const songElements = document.querySelectorAll(".AudioPlaylistSnippet__audioRow");

    for (const songElement of songElements) {
      const artist = songElement.querySelector(".audio_row__performers a").textContent;
      const song = songElement.querySelector(".audio_row__title_inner").textContent;
      const duration = songElement.querySelector(".audio_row__duration").textContent;

      songsData.push({ artist, song, duration });
    }

    return songsData;
  });

  // Write scraped data to JSON file
  fs.writeFileSync("workout_songs.json", JSON.stringify(playlistSongs, null, 2));

  await browser.close();
}

main();