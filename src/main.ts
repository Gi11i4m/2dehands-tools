import { bootstrap } from "@dx/inject";
import { Server } from "./server.ts";

async function run() {
  await bootstrap(Server).run();
}

Deno.cron(
  "Vernieuw zoekertjes elke nacht",
  "0 0 * * *",
  async () => await run(),
);

await run();
