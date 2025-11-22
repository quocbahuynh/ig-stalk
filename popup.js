const output = document.getElementById("output");

async function sendMessageToActiveTab(message) {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
            resolve(response);
        });
    });
}

document.getElementById("startBtn").addEventListener("click", async () => {
    output.textContent = "Tracking started...";
    const result = await sendMessageToActiveTab({ action: "TRACK_FOLLOWING" });
    if (!result) {
        output.textContent = "Cannot detect user or not on profile page!";
        return;
    }
    output.innerHTML = `<b>Tracking initialized!</b><br>
        New Users: ${result.newUsers.join(", ")}<br>
        Removed Users: ${result.removedUsers.join(", ")}`;
});

document.getElementById("checkBtn").addEventListener("click", async () => {
    output.textContent = "Checking changes...";
    const result = await sendMessageToActiveTab({ action: "TRACK_FOLLOWING" });
    if (!result) {
        output.textContent = "Cannot detect user or not on profile page!";
        return;
    }
    output.innerHTML = `<b>Check result:</b><br>
        New Users: ${result.newUsers.join(", ")}<br>
        Removed Users: ${result.removedUsers.join(", ")}`;
});

document.addEventListener("DOMContentLoaded", async () => {
    const usernameDisplay = document.getElementById("usernameDisplay");
    const response = await sendMessageToActiveTab({ action: "GET_USERNAME" });
    usernameDisplay.textContent = response?.username
        ? `Username: ${response.username}`
        : "Username: Unknown";
});
