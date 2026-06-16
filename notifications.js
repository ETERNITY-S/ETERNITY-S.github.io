import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;
    }

    loadNotifications(user.uid);
});

async function loadNotifications(userId) {

    const container =
        document.getElementById("notificationsContainer");

    container.innerHTML = "";

    const q = query(
        collection(db, "notifications"),
        where("receiverId", "==", userId),
        orderBy("createdAt", "desc")
    );

    const snapshot =
        await getDocs(q);

    snapshot.forEach((notificationDoc) => {

        const notification =
            notificationDoc.data();

        container.innerHTML += `
            <div class="notification-card">
                ${notification.text}
            </div>
        `;
    });
}
