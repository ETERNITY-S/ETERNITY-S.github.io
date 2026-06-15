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

    const friendsContainer =
        document.getElementById("friendsContainer");

    friendsContainer.innerHTML = "";

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

        const friendRef =
            doc(db, "users", request.receiverId);

        const friendSnap =
            await getDoc(friendRef);

        if (!friendSnap.exists()) continue;

        const friend =
            friendSnap.data();

        friendsContainer.innerHTML += `
            <div class="friend-card">

                <div>
                    <h3>${friend.username}</h3>
                    <p>${friend.email}</p>
                </div>

                <button>
                    Message
                </button>

            </div>
        `;
    }

    for (const requestDoc of receivedSnapshot.docs) {

        const request = requestDoc.data();

        const friendRef =
            doc(db, "users", request.senderId);

        const friendSnap =
            await getDoc(friendRef);

        if (!friendSnap.exists()) continue;

        const friend =
            friendSnap.data();

        friendsContainer.innerHTML += `
            <div class="friend-card">

                <div>
                    <h3>${friend.username}</h3>
                    <p>${friend.email}</p>
                </div>

                <button>
                    Message
                </button>

            </div>
        `;
    }
}
