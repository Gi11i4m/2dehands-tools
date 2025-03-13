fetch("https://www.2dehands.be/my-account/sell/api/listings?batchNumber=1&batchSize=50", {
    method: "GET",
    credentials: "include" // Ensures cookies are sent with the request
}).then((response) => response.json())
    .then(listings => console.log(listings))


// Listen for a message to trigger fetching
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "fetchListings") {
//         fetchListings().then(() => sendResponse({ status: "done" }));
//         return true; // Keeps the message channel open for async response
//     }
// });
