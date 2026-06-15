import {
  auth,
  db,
  createUserWithEmailAndPassword
} from "./firebase.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", async () => {

  const email =
    document.getElementById("email").value;
 
  const username =
  document.getElementById("username").value;

  const password =
    document.getElementById("password").value;

  try {

   const userCredential =
  await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

const user = userCredential.user;
    await setDoc(
  doc(db, "users", user.uid),
  {
    username: username,
    email: email,
    bio: "",
    createdAt: new Date()
  }
);

    alert("Account created successfully!");

    window.location.href = "feed.html";

  } catch (error) {

    alert(error.message);

  }

});
