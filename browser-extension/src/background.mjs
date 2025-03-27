import { showNotification } from "./notifications.mjs";
import { loop } from "./loop.mjs";
import { extendAd, getExpiringAds } from "./2dehands.client.mjs";
import { pluralize } from "./grammar.js";

async function checkAndExtendAlmostExpiringAds() {
  try {
    const expiringAds = await getExpiringAds();

    console.info(
      `🔍 Je hebt ${expiringAds.length} bijna verlopen ${pluralize("zoekertje", expiringAds.length)}!`,
    );

    if (expiringAds.length === 0) {
      return;
    }

    await Promise.all(expiringAds.map(extendAd));
    showNotification(
      `${expiringAds.length} ${pluralize("zoekertje", expiringAds.length)} verlengd!`,
    );
  } catch (e) {
    showNotification(
      `❌ Verlengen van 2dehands zoekertjes is mislukt! Ben je ingelogd?`,
    );
    throw e;
  }
}

void loop(checkAndExtendAlmostExpiringAds, 60);
