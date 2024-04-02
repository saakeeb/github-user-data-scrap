// server.js
const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const cors = require("cors"); // Import the cors module

const app = express();

app.use(cors()); // Use cors middleware to enable CORS for all routes

app.use(express.json());

app.post("/github-data", async (req, res) => {
  try {
    const { githubName } = req.body;
    console.log("githubName: ", githubName);
    const gitUrl = `https://github.com/${githubName}`;
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1920, height: 1080 },
    });
    const page = await browser.newPage();
    await page.goto(gitUrl, { waitUntil: "networkidle2" });
    const contribution = await page.waitForSelector(
      ".ContributionCalendar-grid"
    );
    await contribution.scrollIntoView();
    const screenshotPath = `public/${githubName}_contribution.png`;
    await contribution.screenshot({ path: screenshotPath });

    const name = await page.waitForSelector("h1 span[itemprop='name']");
    const fullName = await page.evaluate(
      (element) => element.textContent,
      name
    );
    const nameRegex = /\b[A-Z][a-z]+\s[A-Z][a-z]+\b/;
    const extractedName = fullName.match(nameRegex);
    const fName = extractedName[0];

    const follower = await page.waitForSelector(
      ".js-profile-editable-area a:nth-child(1) span"
    );
    const followerText = await page.evaluate(
      (element) => element.textContent,
      follower
    );

    const following = await page.waitForSelector(
      ".js-profile-editable-area a:nth-child(2) span"
    );
    const followingText = await page.evaluate(
      (element) => element.textContent,
      following
    );

    const company = await page.waitForSelector(
      ".js-profile-editable-area .vcard-details .p-org div"
    );
    const companyName = await page.evaluate(
      (element) => element.textContent,
      company
    );

    const location = await page.waitForSelector(
      ".js-profile-editable-area .vcard-details .p-label"
    );
    const locationName = await page.evaluate(
      (element) => element.textContent,
      location
    );

    const userLink = await page.evaluate(
      () =>
        document.querySelector(".js-profile-editable-area li:nth-child(4) > a")
          ?.href
    );

    const userTwitter = await page.evaluate(
      () =>
        document.querySelector(".js-profile-editable-area li:nth-child(5) > a")
          ?.href
    );

    const userLinkedin = await page.evaluate(
      () =>
        document.querySelector(".js-profile-editable-area li:nth-child(6) > a")
          ?.href
    );

    const userLink2 = await page.evaluate(
      () =>
        document.querySelector(".js-profile-editable-area li:nth-child(7) > a")
          ?.href
    );

    const userLink3 = await page.evaluate(
      () =>
        document.querySelector(".js-profile-editable-area li:nth-child(8) > a")
          ?.href
    );

    await browser.close();
    const response = {
      screenshotPath,
      gitUrl,
      fName,
      followerText,
      followingText,
      companyName,
      locationName,
      userTwitter,
      userLinkedin,
      userLink,
      userLink2,
      userLink3,
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
