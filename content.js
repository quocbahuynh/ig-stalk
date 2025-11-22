function getIgAppId() {
    if (window._sharedData && window._sharedData.config) {
        return window._sharedData.config.viewerId ? "936619743392459" : null;
    }

    const scripts = Array.from(document.querySelectorAll("script"));
    for (const script of scripts) {
        const text = script.textContent;
        const match = text.match(/"app_id":"(\d+)"/);
        if (match) return match[1];
    }

    return "936619743392459";
}

function getUsernameTracking(){
    const url = window.location.pathname;
    const parts = url.split('/').filter(Boolean);

    const usernameFromUrl = parts[0];
    return usernameFromUrl;
}

async function fetchAllFollowing(maxId = 0) {
    const xIgAppId = getIgAppId();
    const url = `https://www.instagram.com/api/v1/friendships/5539954990/following/?count=50&max_id=${maxId}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "accept": "*/*",
                "x-ig-app-id": xIgAppId,
            },
            credentials: "include"
        });

        const data = await response.json();

        const currentUsernames = data.users.map(u => u.username);
        const nextMaxId = data.next_max_id;

        if (nextMaxId) {
            const nextPageUsernames = await fetchAllFollowing(nextMaxId);
            return currentUsernames.concat(nextPageUsernames);
        } else {
            return currentUsernames;
        }
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}

async function trackFollowing() {
    const usernameToTrack = getUsernameTracking();
    if (!usernameToTrack) {
        console.error("Không xác định được username để theo dõi.");
        return;
    }
    const localStorageSaveKey = `fl_${usernameToTrack}`;
    const previousUsernames = JSON.parse(localStorage.getItem(localStorageSaveKey) || "[]");

    const allUsernames = await fetchAllFollowing(0);

    const newUsers = allUsernames.filter(u => !previousUsernames.includes(u));
    const removedUsers = previousUsernames.filter(u => !allUsernames.includes(u));

    localStorage.setItem(localStorageSaveKey, JSON.stringify(allUsernames));

    return { newUsers, removedUsers };
}

window.IGTracker = { trackFollowing };