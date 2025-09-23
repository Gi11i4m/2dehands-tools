const ALARM_NAME = "2dehands-tools-alarm";

/**
 * Executes a function immediately and then repeatedly at a specified interval, using the chrome.alarms API.
 *
 * @param {() => void} fn - The function to execute.
 * @param {number} periodInMinutes - The interval in minutes.
 */
export async function loop(fn, periodInMinutes) {
  fn();

  await chrome.alarms.clear(ALARM_NAME);
  await chrome.alarms.create(ALARM_NAME, { periodInMinutes });

  chrome.alarms.onAlarm.addListener(async (alarm) => {
    const idleState = (await chrome.idle?.queryState(5)) || "locked";
    if (idleState === "locked" || window.navigator.onLine === false) {
      console.info("🔒 System is locked or offline, not triggering extension");
    } else if (alarm.name === ALARM_NAME) {
      fn();
    }
  });
}
