#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title 2dehands
// @raycast.mode compact

// Optional parameters:
// @raycast.icon ⏱️

// Documentation:
// @raycast.description Verleng 2dehands zoekertjes
// @raycast.author gilliam_flebus
// @raycast.authorURL https://raycast.com/gilliam_flebus

import { webkit } from "playwright";
import dotenv from "@dotenvx/dotenvx";

dotenv.config({ path: "../.env" });

const url = "https://www.2dehands.be";
const browser = await webkit.launch({ headless: false });
const context = await this.browser.newContext();
const page = await context.newPage();

await this.getUserButton(this.page).waitFor({
  state: "visible",
  timeout: 10000,
});
try {
  await open2dehandsAndAcceptCookies();
  await login();
  await verlengBijnaVerlopenZoekertjes();
} catch (e) {
  console.error(e);
  await takeScreenshot();
} finally {
  await this.browser?.close();
}

async function takeScreenshot() {
  const page = await this.getOrInitPage(true);
  await page.screenshot({ path: "screenshot.png" });
}

async function open2dehandsAndAcceptCookies() {
  const page = await this.getOrInitPage(true);
  await page.goto(this.url);
  const cookieIframeLocator = `iframe[title="SP Consent Message"]`;
  if (await page.locator(cookieIframeLocator).isVisible()) {
    await page
      .frameLocator(cookieIframeLocator)
      .locator('button[title="Accepteren"]')
      .click();
  }
  // Saving cookie preferences needs a bit of time
  await new Promise((resolve) => setTimeout(resolve, 3000));
}

async function login() {
  const page = await this.getOrInitPage(true);
  await page.goto(`${this.url}/identity/v2/login`);
  await page.locator(`input[id="email"]`).fill(process.env.TWEEDEHANDS_USER);
  await page.locator(`input[id="password"]`).fill(process.env.TWEEDEHANDS_PASS);
  await page.locator(`button:has-text("Inloggen met je e-mailadres")`).click();
  await this.getUserButton(page).waitFor({
    state: "visible",
    timeout: 10001,
  });
}

async function waitForTwoFactor() {
  const page = await this.getOrInitPage(true);
  if (await page.locator(`div[id="two-factor-auth-app-root"]`).isVisible()) {
    const twoFactorCode = await this.waitForTwoFactorCode();
    await this.enterTwoFactorCode(twoFactorCode);
  }
}

function getUserButton(page) {
  return page.locator(`span`).getByText("Gilliam Flebus");
}

async function verlengBijnaVerlopenZoekertjes() {
  const page = await this.getOrInitPage();
  await this.getUserButton(page).click();
  await this.page.locator(`a[data-role="mymp-myAds"]`).first().click();
  const allVerlengenButtons = await page.locator(`a[href="#verlengen"]`).all();
  await Promise.all(allVerlengenButtons.map((button) => button.click()));
  return allVerlengenButtons.length;
}
