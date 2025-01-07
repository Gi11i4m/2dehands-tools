import { HTTPStatus } from "@oneday/http-status";
import { Decorator } from "./decorator.ts";
import { HttpError } from "@udibo/http-error";

export const checkApiKey =
  (apiKey: string): Decorator => (request: Request) => {
    const requestApiKey = request.headers.get("Authorization");
    if (requestApiKey !== apiKey) {
      throw new HttpError(
        HTTPStatus.Unauthorized,
        `${requestApiKey ? "Invalid" : "Missing"} API key`,
      );
    }
    return request;
  };
