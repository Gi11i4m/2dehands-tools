import { difference, memoize } from "es-toolkit";

export const envKeys = [
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
