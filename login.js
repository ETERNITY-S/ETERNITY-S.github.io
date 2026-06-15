import {
  auth,
  signInWithEmailAndPassword
} from "./firebase.js";

const loginBtn =
  document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {

  const email =
    document.getElementById("loginEmail").value;

  const password =
    document.getElementById("loginPassword").value;

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    alert("Login successful!");

    window.location.href = "feed.html";

  } catch (error) {

    alert(error.message);

  }

});
