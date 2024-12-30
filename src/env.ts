import { difference, memoize } from "es-toolkit";

export const envKeys = [
  "LOCAL",
  "TWEEDEHANDS_USER",
  "TWEEDEHANDS_PASS",
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

// Helpers
export const isLocal = () => JSON.parse(env().LOCAL) as boolean;
