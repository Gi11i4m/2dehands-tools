export type DbKey = "twoFactorCode";

export class DatabaseClient {
  private db = {};

  async getValue<T>(key: DbKey) {
    return this.db[key];
  }

  async setValue(key: DbKey, value: unknown) {
    this.db = { ...this.db, [key]: value };
  }
}

export const databaseClient = new DatabaseClient();
