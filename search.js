import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    getDocs,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;
    }

    currentUser = user;

    loadUsers();
});

async function loadUsers() {

    const usersContainer =
        document.getElementById("usersContainer");

    usersContainer.innerHTML = "";

    const snapshot =
        await getDocs(collection(db, "users"));

    snapshot.forEach((userDoc) => {

        const userData = userDoc.data();

        if (userDoc.id === currentUser.uid) return;

        usersContainer.innerHTML += `
            <div class="user-card">

                <div>
                    <h3>${userData.username}</h3>
                    <p>${userData.email}</p>
                </div>

                <button
                    onclick="sendRequest('${userDoc.id}')">
                    Add Friend
                </button>

            </div>
        `;
    });
}

window.sendRequest = async function(receiverId) {

    await addDoc(
        collection(db, "friendRequests"),
        {
            senderId: currentUser.uid,
            receiverId: receiverId,
            status: "pending",
            createdAt: serverTimestamp()
        }
    );

    alert("Friend request sent!");
};
