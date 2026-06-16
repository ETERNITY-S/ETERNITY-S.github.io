import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    query,
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {

    if (!user) return;

    const q = query(
        collection(db, "notifications"),
        where("receiverId", "==", user.uid)
    );

    onSnapshot(q, (snapshot) => {

        const badge =
            document.getElementById("notificationBadge");

        if (!badge) return;

        const count =
            snapshot.docs.length;

        badge.textContent =
            count > 0 ? `(${count})` : "";

    });

});
