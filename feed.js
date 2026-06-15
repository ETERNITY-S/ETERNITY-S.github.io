import {
    collection,
    addDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


let currentUser = null;
let currentUsername = "";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    currentUser = user;

    const userRef =
        doc(db, "users", user.uid);

    const userSnap =
        await getDoc(userRef);

    if (userSnap.exists()) {

        currentUsername =
            userSnap.data().username;
    }

    loadPosts();
});

const postBtn = document.getElementById("postBtn");

postBtn.addEventListener("click", async () => {

    const text = document.getElementById("postText").value;

    if (text.trim() === "") return;

    await addDoc(collection(db, "posts"), {

        author: currentUsername,
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
