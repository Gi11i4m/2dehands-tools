import type { Handler } from "@std/http/unstable-route";
import { Injectable } from "@dx/inject";
import { DatabaseClient } from "../clients/database.client.ts";

@Injectable()
export class TwoFactorHandler {
  constructor(
    private readonly db: DatabaseClient,
  ) {}

  get handler(): Handler {
    return async (req) => {
      await this.db.setValue("twoFactorCode", await req.json());
      return new Response(
        `🔑 Code received!`,
      );
    };
  }
}
