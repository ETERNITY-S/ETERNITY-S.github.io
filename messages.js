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
    getDoc,
    addDoc,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

let currentUser = null;
let selectedFriendId = null;

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

window.selectFriend = async function(friendId, username) {

    selectedFriendId = friendId;

    document.getElementById("chatTitle").textContent =
        username;

    loadMessages();
};

document.getElementById("sendBtn")
.addEventListener("click", async () => {

    if (!selectedFriendId) {

        alert("Select a friend first");

        return;
    }

    const input =
        document.getElementById("messageInput");

    const text =
        input.value.trim();

    if (!text) return;

    await addDoc(
        collection(db, "messages"),
        {
            senderId: currentUser.uid,
            receiverId: selectedFriendId,
            text: text,
            createdAt: serverTimestamp()
        }
    );

    input.value = "";

    loadMessages();
});

async function loadMessages() {

    if (!selectedFriendId) return;

    const container =
        document.getElementById("messagesContainer");

    container.innerHTML = "";

    const snapshot =
        await getDocs(
            query(
                collection(db, "messages"),
                orderBy("createdAt")
            )
        );

    snapshot.forEach((msgDoc) => {

        const msg = msgDoc.data();

        const belongsToChat =

            (
                msg.senderId === currentUser.uid &&
                msg.receiverId === selectedFriendId
            )

            ||

            (
                msg.senderId === selectedFriendId &&
                msg.receiverId === currentUser.uid
            );

        if (!belongsToChat) return;

        const cssClass =
            msg.senderId === currentUser.uid
            ? "sent"
            : "received";

        container.innerHTML += `
            <div class="message ${cssClass}">
                ${msg.text}
            </div>
        `;
    });

    container.scrollTop =
        container.scrollHeight;
}
                
