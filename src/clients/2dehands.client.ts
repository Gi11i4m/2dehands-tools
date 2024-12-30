import { Injectable } from "@dx/inject";
import { env } from "../env.ts";
import { wrapFetch } from "@jd1378/another-cookiejar";

const fetch = wrapFetch();

@Injectable()
export class TweedehandsClient {
  private readonly url = "https://www.2dehands.be";

  async verlengZoekertjes() {
    const loginRes = await fetch(`${this.url}/identity/v2/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Mp-Xsrf":
          "1735589410343.33e8fe4e0a5f867cbb1680d74d0f482ec1668ed7de0ee402625893d35580183b",
      },
      body: JSON.stringify({
        email: env().TWEEDEHANDS_USER,
        password: env().TWEEDEHANDS_PASS,
        rememberMe: false,
        threatMetrix: {
          timestamp: 1735589410469,
          signature: "tYnMcZlPKY/S9KlJ5JWI9F3DZIg=",
          uuid: "b268bf43-558c-4b3c-8159-8d4029d07206",
          domain: "https://faas.2dehands.be",
          pageID: 14,
        },
      }),
    });

    console.log(await loginRes.text());

    const res = await fetch(
      `${this.url}/my-account/sell/api/listings`,
    );
    const listings = await res.text();
    console.log(listings);
    return res.json();
  }
}
