import { Injectable } from "@dx/inject";
import ora, { Color, Ora } from "ora";

export type ProgressOptions<R = undefined> = {
  color?: Color;
  text?: string;
  postFn?: (result: R) => void;
};

@Injectable()
export class ProgressClient {
  private ora: Ora = ora();

  async exec<R>(
    fn: () => Promise<R>,
    { color, text, postFn }: ProgressOptions<R>,
  ) {
    this.color(color || "cyan").text(text + "..." || "⏳ Working...");
    const result = await fn();
    this.stop();
    if (postFn) postFn(result);
    return result;
  }

  color(color: Color) {
    if (!this.ora.isSpinning) this.ora.start();
    this.ora.color = color;
    return this;
  }

  text(text: string) {
    if (!this.ora.isSpinning) this.ora.start();
    this.ora.text = text;
    return this;
  }

  info(text?: unknown) {
    if (typeof text === "string") {
      this.ora.info(text);
      return this;
    }
    console.log(text);
    return this;
  }

  stop() {
    this.ora.stop();
    return this;
  }
}
