(async () => {
  // Wait until mail is loaded
  const unread2dehandsMail = await waitUntil(() => getUnread2dehandsMails());

  // Extend almost expired 2dehands zoekertjes
  await extendAll(getVerlooptBijna2dehandsMails());

  // Delete all unread 2dehands mails
  await deleteAll(unread2dehandsMail);
})();

/** @returns {Element[]} */
function getUnread2dehandsMails() {
  return Array.from(document.getElementsByClassName("zA zE")).filter((mail) =>
    mail.textContent.includes("2dehands"),
  );
}

/** @returns {Element[]} */
function getVerlooptBijna2dehandsMails() {
  return getUnread2dehandsMails().filter((mail) =>
    mail.textContent.includes("verloopt bijna"),
  );
}

/** @param mails {Element[]} */
async function extendAll(mails) {
  await Promise.all(
    mails.map((mail) => {
      // TODO: Fire POST request to 2dehands to extend Zoekertje
    }),
  );
}

/** @param mails {Element[]} */
async function deleteAll(mails) {
  mails.forEach((mail) =>
    mail.querySelector('[data-tooltip="Selecteren"]').click(),
  );
  await waitFor(1);
  document.querySelector('[data-tooltip="Verwijderen"]').click();
}

/**
 * Polls until the specified condition is met
 * @template T
 * @param {() => T} conditionFn - Function that returns a value, resolves when value is truthy
 * @returns {Promise<T>} Promise that resolves with the truthy value when condition is met
 * @description Checks the condition every 500ms until it returns a truthy value, then resolves the promise
 * @example
 * // Wait until an element exists
 * await waitUntil(() => document.getElementById('myElement'));
 */
function waitUntil(conditionFn) {
  return new Promise((resolve, _) => {
    const interval = setInterval(() => {
      const result = conditionFn();
      if (result) {
        clearInterval(interval);
        resolve(result);
      }
    }, 500);
  });
}

function waitFor(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
