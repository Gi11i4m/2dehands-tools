/**
 * Returns the pluralized form of a word based on the given count.
 *
 * @param {string} word - The word to pluralize.
 * @param {number} count - The number determining whether to pluralize the word.
 * @returns {string} The pluralized word if `count` is not 1, otherwise the singular form.
 *
 * @example
 * pluralize("apple", 1); // "apple"
 * pluralize("apple", 2); // "apples"
 */
export function pluralize(word, count) {
  return word + (count === 1 ? "" : "s");
}
