const output = document.getElementById("output");

document.getElementById("startBtn").addEventListener("click", async () => {
    output.textContent = "Tracking started...";
    chrome.scripting.executeScript({
        target: { tabId: (await chrome.tabs.query({ active: true, currentWindow: true }))[0].id },
        func: async () => {
            const result = await window.IGTracker.trackFollowing();
            return result;
        }
    }, (injectionResults) => {
        const result = injectionResults[0].result;
        if (!result) {
            output.textContent = "Cannot detect user or not on profile page!";
            return;
        }
        output.innerHTML = `<b>Tracking initialized!</b><br>
        New Users: ${result.newUsers.join(", ")}<br>
        Removed Users: ${result.removedUsers.join(", ")}`;
    });
});

document.getElementById("checkBtn").addEventListener("click", async () => {
    output.textContent = "Checking changes...";
    chrome.scripting.executeScript({
        target: { tabId: (await chrome.tabs.query({ active: true, currentWindow: true }))[0].id },
        func: async () => {
            const result = await window.IGTracker.trackFollowing();
            return result;
        }
    }, (injectionResults) => {
        const result = injectionResults[0].result;
        if (!result) {
            output.textContent = "Cannot detect user or not on profile page!";
            return;
        }
        output.innerHTML = `<b>Check result:</b><br>
        New Users: ${result.newUsers.join(", ")}<br>
        Removed Users: ${result.removedUsers.join(", ")}`;
    });
});
