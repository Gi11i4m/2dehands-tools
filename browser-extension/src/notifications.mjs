/**
 * Displays a Chrome notification with a given message.
 *
 * @param {string} message - The message to display in the notification.
 */
export function showNotification(message) {
  chrome.notifications.create("FAILED_TO_FETCH_2DEHANDS", {
    iconUrl: "../assets/2dehands.png",
    type: "basic",
    title: "2dehands",
    message,
  });
}
