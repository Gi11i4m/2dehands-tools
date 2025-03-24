import { showNotification } from "./notifications.mjs";
import { loop } from "./loop.mjs";
import { extendAd, getExpiringAds } from "./2dehands.client.mjs";
import { pluralize } from "./grammar.js";

async function checkAndExtendAlmostExpiringAds() {
  try {
    const expiringAds = await getExpiringAds();

    console.log(
      `Je hebt ${expiringAds.length} bijna verlopen ${pluralize("zoekertje", expiringAds.length)}!`,
    );

    if (expiringAds.length === 0) {
      return;
    }

    await Promise.all(expiringAds.map(extendAd));
    showNotification(
      `${expiringAds.length} ${pluralize("zoekertje", expiringAds.length)} verlengd!`,
    );
  } catch (e) {
    console.error(e);
    showNotification(
      `Verlengen van 2dehands zoekertjes is mislukt! Ben je ingelogd?`,
    );
  }
}

void loop(checkAndExtendAlmostExpiringAds, 60);
