import { Injectable } from "@dx/inject";

export type DbKey = "twoFactorCode";

@Injectable()
export class DatabaseClient {
  private db?: Deno.Kv;

  async getDb() {
    if (!this.db) {
      this.db = await Deno.openKv();
    }
    return this.db;
  }

  async getValue<T>(key: DbKey) {
    const db = await this.getDb();
    return (await db.get<T>([
      key,
    ])).value;
  }

  async setValue(key: DbKey, value: unknown) {
    const db = await this.getDb();
    await db.set([key], value);
  }
}
