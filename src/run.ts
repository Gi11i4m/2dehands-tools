import { bootstrap } from "@dx/inject";
import { Server } from "./server.ts";

await bootstrap(Server).run();
