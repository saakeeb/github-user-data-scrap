import puppeteer from "puppeteer"; // created by google core team
import { setTimeout } from "timers/promises"; //node default promise
import PQueue from "p-queue"; //simple return promise
import fs from "fs";

const browser = await puppeteer.launch({
  headless: false, // make headlefull, no head less
  defaultViewport: { width: 1920, height: 1080 }, // make screen size
  // slowMo: 250, //make it slow process
  userDataDir: "temporary", // keep the created instace so that it wont recreate and make performance better
});

const page = await browser.newPage();

const githubName = "saakeeb";

await page.goto("https://duckduckgo.com");
await page.waitForSelector('[aria-label="Search with DuckDuckGo"]');
await page.type('[aria-label="Search with DuckDuckGo"]', githubName);
await page.click('button[aria-label="Search"]');

await page.waitForSelector(".react-results--main  li");

const gitUrl = await page.evaluate((githubName) => {
  const searchResults = document.querySelectorAll(".react-results--main li");
  for (const result of searchResults) {
    const linkElement = result.querySelector(
      "[data-testid='result-extras-url-link']"
    );
    if (
      linkElement &&
      linkElement.href === `https://github.com/${githubName}`
    ) {
      return linkElement.href;
    }
  }
  return null;
}, githubName);

await setTimeout(1000);
await page.goto(gitUrl, { waitUntil: "networkidle2" });

const contribution = await page.waitForSelector(".ContributionCalendar-grid");
await setTimeout(1000);
await contribution.scrollIntoView();
await setTimeout(1000);
await contribution.screenshot({ path: "contribution.png" });

const name = await page.waitForSelector("h1 span[itemprop='name']");
const fullName = await page.evaluate((element) => element.textContent, name);
const nameRegex = /\b[A-Z][a-z]+\s[A-Z][a-z]+\b/;
const extractedName = fullName.match(nameRegex);


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

const userLin3 = await page.evaluate(
  () =>
    document.querySelector(".js-profile-editable-area li:nth-child(8) > a")
      ?.href
);

const allInformation = [
  {
    Name: extractedName[0],
    Follower: followerText,
    Following: followingText,
    Company: companyName,
    Location: locationName,
    UserLink: userLink,
    Twitter: userTwitter,
    Linkedin: userLinkedin,
    UserLink2: userLink2,
    UserLink3: userLin3,
  },
];

const jsonData = JSON.stringify(allInformation, null, 2);
fs.writeFileSync("all_links_data.json", jsonData);

await browser.close();
