import { Injectable } from "@dx/inject";
import { env } from "../env.ts";
import { Browser, Page, webkit } from "playwright";
import { ProgressClient } from "./progress.client.ts";
import { DatabaseClient } from "./database.client.ts";

@Injectable()
export class TweedehandsPlaywrightClient {
  private readonly url = "https://www.2dehands.be";
  private browser?: Browser;
  private page?: Page;

  constructor(
    private readonly progress: ProgressClient,
    private readonly db: DatabaseClient,
  ) {}

  async getOrInitPage() {
    if (this.page) return this.page;

    this.browser = await webkit.launch();
    const context = await this.browser.newContext();
    this.page = await context.newPage();
    return this.page;
  }

  async verlengZoekertjes() {
    try {
      await this.progress.exec(() => this.open2dehandsAndAcceptCookies(), {
        color: "yellow",
        text: "🍪 Cookies accepteren...",
      });
      await this.progress.exec(() => this.login(), {
        text: "👤 Inloggen...",
      });
      await this.progress.exec(
        () => this.verlengBijnaVerlopenZoekertjes(),
        {
          color: "green",
          text: "🖱️ Zoekertjes verlengen...",
          postFn: (amount) =>
            console.log(
              `✅ ${amount} zoekertje${amount === 1 ? "" : "s"} verlengd!`,
            ),
        },
      );
    } catch (error) {
      const page = await this.getOrInitPage();
      await this.progress.exec(
        () => page.screenshot({ path: "screenshot.png" }),
        {
          color: "red",
          text: "🖨️ Screenshot maken...",
          postFn: () => console.log("📸 Screenshot opgeslagen"),
        },
      );
      throw error;
    } finally {
      await this.browser?.close();
    }
  }

  private async open2dehandsAndAcceptCookies() {
    const page = await this.getOrInitPage();
    await page.goto(this.url);
    const cookieIframeLocator = `iframe[title="SP Consent Message"]`;
    if (await page.locator(cookieIframeLocator).isVisible()) {
      await page.frameLocator(cookieIframeLocator).locator(
        'button[title="Accepteren"]',
      ).click();
    }
  }

  private async login() {
    const page = await this.getOrInitPage();
    await page.locator(`[data-role="login"]`).click();
    await page.locator(`input[id="email"]`).fill(env().TWEEDEHANDS_USER);
    await page.locator(`input[id="password"]`).fill(env().TWEEDEHANDS_PASS);
    await page.locator(`button:has-text("Inloggen met je e-mailadres")`)
      .click();
    if (await page.locator(`div[id="two-factor-auth-app-root"]`).isVisible()) {
      const twoFactorCode = await this.waitForAndRemoveTwoFactorCode();
      await this.enterTwoFactorCode(twoFactorCode);
    }
    await page.locator(`span`).getByText("Gilliam Flebus").isVisible();
  }

  private waitForAndRemoveTwoFactorCode() {
    return new Promise<string>((resolve) => {
      const intervalId = setInterval(async () => {
        const twoFactorCode = await this.db.getValue<string>("twoFactorCode");
        if (twoFactorCode) {
          clearInterval(intervalId);
          await this.db.setValue("twoFactorCode", undefined);
          resolve(twoFactorCode);
        }
      }, 1000);
    });
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
    const myAdsUrl = `${this.url}/my-account/sell/index.html`;
    await page.goto(myAdsUrl);
    await page.waitForURL(myAdsUrl);
    const allVerlengenButtons = await page.locator(`a[href="#verlengen"]`)
      .all();
    await Promise.all(allVerlengenButtons.map((button) => button.click()));
    return allVerlengenButtons.length;
  }
}
