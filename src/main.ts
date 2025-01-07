import { bootstrap } from "@dx/inject";
import { Server } from "./server.ts";

const server = bootstrap(Server);

server.serve();

Deno.cron(
  "Vernieuw zoekertjes elke nacht",
  "0 0 * * *",
  async () => await server.run(),
);
