document.getElementById("fetchListings").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "fetchListings" }, response => {
        if (response && response.status === "done") {
            document.getElementById("output").textContent = "Fetch completed. Check console for results.";
        } else {
            document.getElementById("output").textContent = "Fetch failed.";
        }
    });
});
