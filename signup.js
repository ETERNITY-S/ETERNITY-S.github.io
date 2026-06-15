import {
  auth,
  createUserWithEmailAndPassword
} from "./firebase.js";

const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", async () => {

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  try {

    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    alert("Account created successfully!");

    window.location.href = "feed.html";

  } catch (error) {

    alert(error.message);

  }

});
