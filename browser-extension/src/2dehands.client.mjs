/**
 * @typedef {Object} Ad
 * @property {string} itemId
 * @property {string} title
 * @property {number} priceCents
 * @property {number} categoryId
 * @property {string} categoryName
 * @property {boolean} expiring
 * @property {string} closeDate
 * @property {string} status
 * @property {boolean} editableByUser
 * @property {boolean} reserved
 * @property {number} viewCount
 * @property {number} highestBid
 * @property {string} priceType
 * @property {{ primary: string, secondary: string, terinary: string }} fotoknallerImages
 * @property {string} primaryImageUrl
 * @property {string} vipUrl
 * @property {string} sVipUrl
 * @property {string[]} verticals
 * @property {boolean} urgencyAvailable
 * @property {boolean} dagTopperAvailable
 * @property {boolean} phoneUpCallAvailable
 * @property {boolean} etalageAvailable
 * @property {boolean} urlAvailable
 * @property {boolean} extraImagesSnippetAvailable
 */

const TWEEDEHANDS_URL = "https://www.2dehands.be";

/**
 * Fetches a list of ads from 2dehands and filters out those that are expiring.
 *
 * @returns {Promise<Ad[]>} A promise that resolves to an array of ad objects where `expiring` is true.
 */
export async function getExpiringAds() {
  const res = await fetch(
    `${TWEEDEHANDS_URL}/my-account/sell/api/listings?batchNumber=1&batchSize=100`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  throwIfNotOk(res);

  const { ads } = await res.json();
  return ads.filter(({ expiring }) => expiring);
}

/** @returns {Promise<string>} */
export async function getXsrfToken() {
  const res = await fetch(`${TWEEDEHANDS_URL}`, {
    method: "GET",
    credentials: "include",
  });

  throwIfNotOk(res);

  const html = await res.text();
  return JSON.parse(
    /window.__HEADER_CONFIG__.?=.?(?<headerConfig>.*);/.exec(html).groups
      .headerConfig,
  ).xsrfToken;
}

/**
 * Sends a request to extend the specified ad on 2dehands.
 *
 * @param {Ad} ad - The ad object to extend.
 * @returns {Promise<void>}
 */
export async function extendAd({ itemId }) {
  const res = await fetch(`${TWEEDEHANDS_URL}/my-account/sell/extend.json`, {
    method: "POST",
    credentials: "include",
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "content-type": "application/json",
      "x-mp-xsrf": await getXsrfToken(),
    },
    body: JSON.stringify({ itemId }),
  });

  throwIfNotOk(res);
}

function throwIfNotOk(res) {
  if (!res.ok) {
    console.error(JSON.stringify(res));
    throw new Error(`${res.status}: ${res.statusText}`);
  }
}
