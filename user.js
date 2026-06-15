import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const params =
    new URLSearchParams(window.location.search);

const userId =
    params.get("uid");

if (!userId) {

    document.getElementById("profileName").textContent =
        "User Not Found";

} else {

    loadUser();
}

async function loadUser() {

    const userRef =
        doc(db, "users", userId);

    const userSnap =
        await getDoc(userRef);

    if (!userSnap.exists()) {

        document.getElementById("profileName").textContent =
            "User Not Found";

        return;
    }

    const data =
        userSnap.data();

    document.getElementById("profileName").textContent =
        data.username;

    document.getElementById("profileEmail").textContent =
        data.email;

    document.getElementById("profileBio").textContent =
        data.bio || "Welcome to ETERNITY-S";
}
