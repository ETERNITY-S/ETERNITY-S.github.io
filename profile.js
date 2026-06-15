import { auth, db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);

  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {

    const data = userSnap.data();

    document.getElementById("username").textContent =
      data.username || "User";

    document.getElementById("bio").textContent =
      data.bio || "No bio yet";

    document.getElementById("postUser1").textContent =
      data.username || "User";

    document.getElementById("postUser2").textContent =
      data.username || "User";
  }

});
