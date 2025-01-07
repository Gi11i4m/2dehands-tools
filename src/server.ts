import { Bootstrapped } from "@dx/inject";
import { TweedehandsPlaywrightClient } from "./clients/2dehands.playwright.client.ts";
import { route } from "@std/http/unstable-route";
import { checkApiKey } from "./decorators/security.decorator.ts";
import { env } from "./env.ts";
import { flow } from "es-toolkit";
import { TwoFactorHandler } from "./handlers/two-factor.handler.ts";
import { HTTPStatus } from "@oneday/http-status";

@Bootstrapped()
export class Server {
  constructor(
    private readonly tweedehandsPlaywrightClient: TweedehandsPlaywrightClient,
    private readonly twoFactorHandler: TwoFactorHandler,
  ) {}

  async run() {
    await this.tweedehandsPlaywrightClient.verlengZoekertjes();
  }

  serve() {
    Deno.serve(
      route(
        [{
          method: ["POST"],
          pattern: new URLPattern({ pathname: "/two_factor" }),
          handler: flow(
            checkApiKey(env().TWEEDEHANDS_TOOLS_API_KEY),
            this.twoFactorHandler.handler,
          ),
        }],
        () => new Response("Not found", { status: HTTPStatus.NotFound }),
      ),
    );
  }
}
