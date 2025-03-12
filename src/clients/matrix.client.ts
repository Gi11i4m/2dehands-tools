import {
  ClientEvent,
  createClient,
  MatrixClient as MxClient,
  RoomEvent,
} from "matrix-js-sdk";
import { env } from "../env";

export class MatrixClient {
  private client: MxClient;

  async init() {
    this.client = createClient({
      baseUrl: env().MATRIX_URL,
    });
    const loginResponse = await this.client.loginWithPassword(
      env().MATRIX_USER,
      env().MATRIX_PASS,
    );
    await this.client.setDeviceDetails(loginResponse.device_id, {
      display_name: `2dehands-tools (${new Date().toISOString()})`,
    });
    this.client = createClient({
      baseUrl: env().MATRIX_URL,
      deviceId: loginResponse.device_id,
      userId: env().MATRIX_USER,
      accessToken: loginResponse.access_token,
      // cryptoStore: new MemoryCryptoStore(),
      // logger: loggerClient,
    });
    await this.client.initRustCrypto({ useIndexedDB: false });
    await this.client.startClient({ initialSyncLimit: 1 });
    await this.client.requestVerification(env().MATRIX_USER);

    return new Promise<void>((res) =>
      this.client.once(ClientEvent.Sync, (state) => {
        console.log("=== SYNC ===");
        console.log(state);
        if (state === "PREPARED") {
          res();
        }
      }),
    );
  }

  async listenForNextMessageFrom(userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const tweedehandsRoom = this.client
        .getRooms()
        .find((room) =>
          room.getMembers().find((member) => member.userId === userId),
        );
      console.log("=== MEMBERS ===");
      tweedehandsRoom.getMembers().forEach((m) => console.log(m.userId));
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

export const matrixClient = new MatrixClient();
