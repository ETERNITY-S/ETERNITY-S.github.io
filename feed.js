import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    currentUser = user;

    loadPosts();
});

const postBtn = document.getElementById("postBtn");

postBtn.addEventListener("click", async () => {

    const text = document.getElementById("postText").value;

    if (text.trim() === "") return;

    await addDoc(collection(db, "posts"), {

        author: currentUser.email,
        content: text,
        createdAt: serverTimestamp()

    });

    document.getElementById("postText").value = "";

    loadPosts();
});

async function loadPosts() {

    const postsContainer =
        document.getElementById("postsContainer");

    postsContainer.innerHTML = "";

    const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {

        const post = doc.data();

        postsContainer.innerHTML += `
            <div class="post">
                <h4>${post.author}</h4>
                <p>${post.content}</p>
            </div>
        `;
    });
}
