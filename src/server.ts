import { Bootstrapped } from "@dx/inject";
import { TweedehandsPlaywrightClient } from "./clients/2dehands.playwright.client.ts";

@Bootstrapped()
export class Server {
  constructor(
    private readonly tweedehandsPlaywrightClient: TweedehandsPlaywrightClient,
  ) {}

  async run() {
    await this.tweedehandsPlaywrightClient.verlengZoekertjes();
  }
}
