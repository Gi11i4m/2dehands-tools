import { showNotification } from "./notifications.mjs";
import { loop, ONE_HOUR_IN_MS, TEN_SECONDS_IN_MS } from "./loop.mjs";
import { getExpiringAds } from "./2dehands.client.mjs";

async function extendAds() {
  const expiringAds = await getExpiringAds();
  showNotification(
    `Je hebt momenteel ${expiringAds.length} bijna verlopen zoekertjes!`,
  );
}

loop(extendAds, ONE_HOUR_IN_MS);
