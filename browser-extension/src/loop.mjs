export const TEN_SECONDS_IN_MS = 10000;
export const ONE_HOUR_IN_MS = 3600000;

/**
 * Executes a function immediately and then repeatedly at a specified interval.
 *
 * @param {() => void} fn - The function to execute.
 * @param {number} ms - The interval in milliseconds.
 */
export function loop(fn, ms) {
  fn();
  setInterval(fn, ms);
}
