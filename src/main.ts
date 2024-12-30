import { bootstrap } from "@dx/inject";
import { Server } from "./server.ts";

Deno.cron(
  "Vernieuw zoekertjes elke nacht",
  "0 0 * * *",
  async () => await bootstrap(Server).run(),
);
