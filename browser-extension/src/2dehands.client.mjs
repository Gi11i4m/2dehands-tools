import { showNotification } from "./notifications.mjs";

export async function getExpiringAds() {
  const res = await fetch(
    "https://www.2dehands.be/my-account/sell/api/listings?batchNumber=1&batchSize=100",
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!res.ok) {
    console.log(res.statusText);
    showNotification(`Failed to fetch from 2dehands (${res.status})`);
    return [];
  }

  const { ads } = await res.json();
  const expiringAds = ads.filter(({ expiring }) => expiring);

  return expiringAds;
}
