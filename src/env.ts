import { difference, memoize } from "es-toolkit";

export const envKeys = [
  "TWEEDEHANDS_USER",
  "TWEEDEHANDS_PASS",
  "TWEEDEHANDS_TOOLS_API_KEY",
  "DENO_KV_URL",
  "DENO_KV_ACCESS_TOKEN",
] as const;

export type Env = {
  [key in typeof envKeys[number]]: string;
};

export const env: () => Env = memoize(() => {
  const env = Deno.env.toObject();
  const missingEnvKeys = difference(envKeys, Object.keys(env));
  if (missingEnvKeys.length > 0) {
    throw new Error(
      `Not all required env variables are present (${
        missingEnvKeys.join(", ")
      })`,
    );
  }
  return env as Env;
});
