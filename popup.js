const output = document.getElementById("output");

async function sendMessageToActiveTab(message) {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
            resolve(response);
        });
    });
}

document.getElementById("trackFollowingBtn").addEventListener("click", async () => {
    output.textContent = "Checking changes...";
    const result = await sendMessageToActiveTab({ action: "TRACK_FOLLOWING" });
    if (!result || (!result.newUsers && !result.removedUsers)) {
        output.textContent = "Cannot detect user, not on profile page, or content script not loaded!";
        return;
    }
    output.innerHTML = `<b>Check result:</b><br>
        New Users: ${(result.newUsers || []).join(", ")}<br>
        Removed Users: ${(result.removedUsers || []).join(", ")}`;
});

document.getElementById("trackFollowerBtn").addEventListener("click", async () => {
    output.textContent = "Checking changes...";
    const result = await sendMessageToActiveTab({ action: "TRACK_FOLLOWERS" });
    if (!result || (!result.newFollowers && !result.removedFollowers)) {
        output.textContent = "Cannot detect user, not on profile page, or content script not loaded!";
        return;
    }
    output.innerHTML = `<b>Check result:</b><br>
        New Followers: ${(result.newFollowers || []).join(", ")}<br>
        Removed Followers: ${(result.removedFollowers || []).join(", ")}`;
});

document.addEventListener("DOMContentLoaded", async () => {
    const usernameDisplay = document.getElementById("usernameDisplay");
    const response = await sendMessageToActiveTab({ action: "GET_USERNAME" });
    usernameDisplay.textContent = response?.username
        ? `Username: ${response.username}`
        : "Username: Unknown";
});

// Add button for fetching articles
const articlesBtn = document.createElement("button");
articlesBtn.id = "fetchArticlesBtn";
articlesBtn.textContent = "Fetch Articles";
articlesBtn.style.backgroundColor = "#ffc107";
articlesBtn.style.color = "#333";
articlesBtn.style.marginBottom = "8px";
document.body.insertBefore(articlesBtn, output);

articlesBtn.addEventListener("click", async () => {
    output.textContent = "Fetching articles...";
    const result = await sendMessageToActiveTab({ action: "FETCH_ARTICLES" });
    console.log("Articles result:", result);
    output.textContent = "Articles fetched! Check console for details.";
});

const checkLikersBtn = document.createElement("button");
checkLikersBtn.id = "checkLikersBtn";
checkLikersBtn.textContent = "Check Likers Change";
checkLikersBtn.style.backgroundColor = "#6f42c1";
checkLikersBtn.style.color = "#fff";
checkLikersBtn.style.marginBottom = "8px";
document.body.insertBefore(checkLikersBtn, output);

checkLikersBtn.addEventListener("click", async () => {
    output.textContent = "Checking likers changes...";
    const result = await sendMessageToActiveTab({ action: "CHECK_LIKERS_CHANGE" });
    if (!result || result.error) {
        output.textContent = "No articles or likers data found!";
        return;
    }
    output.innerHTML = "<b>Likers Change Per Post:</b><br>";
    for (const post of result) {
        output.innerHTML += `<div>
            <b>Post:</b> ${post.mediaId}<br>
            New Likers: ${post.newLikers.join(", ") || "None"}<br>
            Removed Likers: ${post.removedLikers.join(", ") || "None"}<br>
            Total: ${post.total}
        </div><hr>`;
    }
});
