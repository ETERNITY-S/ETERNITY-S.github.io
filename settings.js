import { auth } from "./firebase.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const logoutBtn =
    document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    alert("Logged out successfully");

    window.location.href = "index.html";

});
<script type="module" src="settings.js"></script>
