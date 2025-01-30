import { Injectable } from "@dx/inject";
import { env, isHeadless } from "../env.ts";
import { Browser, Page, webkit } from "playwright";
import { ProgressClient } from "./progress.client.ts";
import { DatabaseClient } from "./database.client.ts";
import { MatrixClient } from "./matrix.client.ts";

@Injectable()
export class TweedehandsPlaywrightClient {
  private readonly url = "https://www.2dehands.be";
  private browser?: Browser;
  private page?: Page;

  constructor(
    private readonly progress: ProgressClient,
    private readonly db: DatabaseClient,
    private readonly matrix: MatrixClient,
  ) {}

  async getOrInitPage(skipLoginCheck = false) {
    if (this.page) {
      if (!skipLoginCheck) {
        await this.getUserButton(this.page).waitFor({
          state: "visible",
          timeout: 30000,
        });
      }
      return this.page;
    }

    this.browser = await webkit.launch({ headless: isHeadless() });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
    return this.page;
  }

  async verlengZoekertjes() {
    try {
      await this.progress.exec(() => this.open2dehandsAndAcceptCookies(), {
        color: "yellow",
        text: "🍪 Cookies accepteren",
      });
      await this.progress.exec(() => this.login(), {
        text: "👤 Inloggen",
      });
      await this.progress.exec(() => this.waitForTwoFactor(), {
        text: "📲 Wachten op 2-factor",
      });
      await this.progress.exec(
        () => this.verlengBijnaVerlopenZoekertjes(),
        {
          color: "green",
          text: "♻️ Zoekertjes verlengen",
          postFn: (amount) =>
            console.log(
              `✅ ${amount} zoekertje${amount === 1 ? "" : "s"} verlengd!`,
            ),
        },
      );
    } catch (error) {
      await this.progress.exec(
        () => this.takeScreenshot(),
        {
          color: "red",
          text: "🖨️ Screenshot maken",
          postFn: () => console.log("📸 Screenshot opgeslagen"),
        },
      );
      throw error;
    } finally {
      await this.browser?.close();
    }
  }

  private async takeScreenshot() {
    const page = await this.getOrInitPage();
    await page.screenshot({ path: "screenshot.png" });
  }

  private async open2dehandsAndAcceptCookies() {
    const page = await this.getOrInitPage(true);
    await page.goto(this.url);
    const cookieIframeLocator = `iframe[title="SP Consent Message"]`;
    if (await page.locator(cookieIframeLocator).isVisible()) {
      await page.frameLocator(cookieIframeLocator).locator(
        'button[title="Accepteren"]',
      ).click();
    }
    // Saving cookie preferences needs a bit of time
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  private async login() {
    const page = await this.getOrInitPage(true);
    await page.goto(`${this.url}/identity/v2/login`);
    await page.locator(`input[id="email"]`).fill(env().TWEEDEHANDS_USER);
    await page.locator(`input[id="password"]`).fill(env().TWEEDEHANDS_PASS);
    await page.locator(`button:has-text("Inloggen met je e-mailadres")`)
      .click();
    await this.getUserButton(page).waitFor({
      state: "visible",
      timeout: 10000,
    });
  }

  private async waitForTwoFactor() {
    const page = await this.getOrInitPage(true);
    if (await page.locator(`div[id="two-factor-auth-app-root"]`).isVisible()) {
      const twoFactorCode = await this.waitForTwoFactorCode();
      await this.enterTwoFactorCode(twoFactorCode);
    }
  }

  private getUserButton(page: Page) {
    return page.locator(`span`).getByText("Gilliam Flebus");
  }

  private async waitForTwoFactorCode() {
    await this.matrix.sync();
    const message = await this.matrix.listenForNextMessage();
    console.log(`=== MESSAGE ===`);
    console.log(message);
    console.log(`=== === === ===`);
    return message;
    // return new Promise<string>((resolve) => {
    //   const intervalId = setInterval(async () => {
    //     const twoFactorCode = await this.db.getValue<string>("twoFactorCode");
    //     if (twoFactorCode) {
    //       clearInterval(intervalId);
    //       await this.db.setValue("twoFactorCode", undefined);
    //       resolve(twoFactorCode);
    //     }
    //   }, 1000);
    // });
  }

  private async enterTwoFactorCode(code: string) {
    const page = await this.getOrInitPage();
    await Promise.all(
      code.split("").map((letter, index) =>
        page.locator(`input[data-testid="otp-input-${index}"]`).fill(letter)
      ),
    );
    await page.locator(`button[class="hz-Button--primary"]`).click();
  }

  private async verlengBijnaVerlopenZoekertjes() {
    const page = await this.getOrInitPage();
    await this.getUserButton(page).click();
    await this.page!.locator(`a[data-role="mymp-myAds"]`).first().click();
    const allVerlengenButtons = await page.locator(`a[href="#verlengen"]`)
      .all();
    await Promise.all(allVerlengenButtons.map((button) => button.click()));
    return allVerlengenButtons.length;
  }
}
