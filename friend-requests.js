import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    addDoc,
    serverTimestamp
}from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;
    }

    currentUser = user;

    loadRequests();
});

async function loadRequests() {

    const requestsContainer =
        document.getElementById("requestsContainer");

    requestsContainer.innerHTML = "";

    const q = query(
        collection(db, "friendRequests"),
        where("receiverId", "==", currentUser.uid),
        where("status", "==", "pending")
    );

    const snapshot = await getDocs(q);

    for (const requestDoc of snapshot.docs) {

        const request = requestDoc.data();

        const senderRef =
            doc(db, "users", request.senderId);

        const senderSnap =
            await getDoc(senderRef);

        const senderData =
            senderSnap.data();

        requestsContainer.innerHTML += `
            <div class="request-card">

                <div>
                    <h3>${senderData.username}</h3>
                    <p>Wants to connect with you</p>
                </div>

                <div class="request-actions">

                    <button
                        onclick="acceptRequest('${requestDoc.id}')">
                        Accept
                    </button>

                    <button
                        onclick="rejectRequest('${requestDoc.id}')">
                        Reject
                    </button>

                </div>

            </div>
        `;
    }
}


};
window.acceptRequest = async function(requestId) {

    await updateDoc(
        doc(db, "friendRequests", requestId),
        {
            status: "accepted"
        }
    );

    const requestSnap =
        await getDoc(
            doc(db, "friendRequests", requestId)
        );

    const requestData =
        requestSnap.data();

    const receiverSnap =
        await getDoc(
            doc(db, "users", currentUser.uid)
        );

    const receiverName =
        receiverSnap.data().username;

    await addDoc(
        collection(db, "notifications"),
        {
            receiverId: requestData.senderId,
            text: `${receiverName} accepted your friend request`,
            createdAt: serverTimestamp(),
            read: false
        }
    );

    alert("Friend request accepted!");

    loadRequests();

};

window.rejectRequest = async function(requestId) {

    await updateDoc(
        doc(db, "friendRequests", requestId),
        {
            status: "rejected"
        }
    );

    const requestSnap =
        await getDoc(
            doc(db, "friendRequests", requestId)
        );

    const requestData =
        requestSnap.data();

    const receiverSnap =
        await getDoc(
            doc(db, "users", currentUser.uid)
        );

    const receiverName =
        receiverSnap.data().username;

    await addDoc(
        collection(db, "notifications"),
        {
            receiverId: requestData.senderId,
            text: `${receiverName} rejected your friend request`,
            createdAt: serverTimestamp(),
            read: false
        }
    );

    alert("Friend request rejected!");

    loadRequests();

};
