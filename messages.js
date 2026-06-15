import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;
    }

    currentUser = user;

    loadFriends();
});

async function loadFriends() {

    const friendsList =
        document.getElementById("friendsList");

    friendsList.innerHTML = "";

    const sentQuery = query(
        collection(db, "friendRequests"),
        where("senderId", "==", currentUser.uid),
        where("status", "==", "accepted")
    );

    const receivedQuery = query(
        collection(db, "friendRequests"),
        where("receiverId", "==", currentUser.uid),
        where("status", "==", "accepted")
    );

    const sentSnapshot =
        await getDocs(sentQuery);

    const receivedSnapshot =
        await getDocs(receivedQuery);

    for (const requestDoc of sentSnapshot.docs) {

        const request = requestDoc.data();

        const friendSnap =
            await getDoc(
                doc(db, "users", request.receiverId)
            );

        if (!friendSnap.exists()) continue;

        const friend =
            friendSnap.data();

        friendsList.innerHTML += `
            <div class="chat-user"
                onclick="selectFriend(
                    '${request.receiverId}',
                    '${friend.username}'
                )">
                ${friend.username}
            </div>
        `;
    }

    for (const requestDoc of receivedSnapshot.docs) {

        const request = requestDoc.data();

        const friendSnap =
            await getDoc(
                doc(db, "users", request.senderId)
            );

        if (!friendSnap.exists()) continue;

        const friend =
            friendSnap.data();

        friendsList.innerHTML += `
            <div class="chat-user"
                onclick="selectFriend(
                    '${request.senderId}',
                    '${friend.username}'
                )">
                ${friend.username}
            </div>
        `;
    }
}

window.selectFriend = function(friendId, username) {

    document.getElementById("chatTitle").textContent =
        username;

    alert("Chat selected: " + username);

};
