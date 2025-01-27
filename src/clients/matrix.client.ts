import { Injectable } from "@dx/inject";
import { ClientEvent, createClient, RoomEvent } from "matrix-js-sdk";
import { env } from "../env.ts";
import { Memoize } from "typescript-memoize";

@Injectable()
export class MatrixClient {
  private readonly client = createClient({
    baseUrl: env().MATRIX_URL,
  });

  @Memoize()
  async sync() {
    await this.client.login("m.login.password", {
      user: env().MATRIX_USER,
      password: env().MATRIX_PASS,
    });
    await this.client.startClient();
    return new Promise<void>((res) =>
      this.client.once(ClientEvent.Sync, (state) => {
        if (state === "PREPARED") {
          this.client.stopClient();
          res();
        }
      })
    );
  }

  async listenForNextMessage(): Promise<string> {
    await this.client.startClient({ initialSyncLimit: 10 });
    return new Promise((resolve) =>
      this.client.on(RoomEvent.Timeline, (event) => {
        if (event.getType() === "m.room.message") {
          resolve(event.event.content!.body);
          this.client.stopClient();
        }
      })
    );
  }
}
