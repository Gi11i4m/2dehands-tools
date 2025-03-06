import { Injectable } from "@dx/inject";
import {
  ClientEvent,
  createClient,
  MemoryCryptoStore,
  RoomEvent,
} from "matrix-js-sdk";
import { env } from "../env.ts";
import { Memoize } from "typescript-memoize";

@Injectable()
export class MatrixClient {
  private readonly client = createClient({
    baseUrl: env().MATRIX_URL,
    deviceId: "01JM4FQYKXEZQPC80ZQ7NY32RY",
    userId: env().MATRIX_USER,
    cryptoStore: new MemoryCryptoStore(),
  });

  @Memoize()
  async sync() {
    await this.client.initRustCrypto();
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

  async listenForNextMessageFrom(userId: string): Promise<string> {
    await this.client.startClient();
    return new Promise((resolve, reject) => {
      const tweedehandsRoom = this.client.getRooms().find((room) =>
        room.getMembers().find((member) => member.userId === userId)
      );
      if (!tweedehandsRoom) {
        return reject(`You have no chats with member ${userId}`);
      }
      this.client.sendTextMessage(
        tweedehandsRoom.roomId,
        "Testing Matrix client",
      );
      tweedehandsRoom.on(RoomEvent.Timeline, (event) => {
        if (event.getType() === "m.room.message") {
          resolve(event.event.content!.body);
          this.client.stopClient();
        }
      });
      // this.client.on(RoomEvent.Timeline, (event) => {
      //   if (event.getType() === "m.room.message") {
      //     resolve(event.event.content!.body);
      //     this.client.stopClient();
      //   }
      // });
    });
  }
}
