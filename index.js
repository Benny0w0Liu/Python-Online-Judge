//Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDQrhwnIkHDNktvR46zM84ORsLOQNw_9WU",
    authDomain: "online-judge---python.firebaseapp.com",
    databaseURL: "https://online-judge---python-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "online-judge---python",
    storageBucket: "online-judge---python.appspot.com",
    messagingSenderId: "760339751081",
    appId: "1:760339751081:web:d6fc2376cfdbd6428249b8"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// Set persistence
setPersistence(auth, browserLocalPersistence);

// Handle login
document.getElementById('login-button').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log('User signed in:', result.user);
            document.getElementById('login-button').src = user.photoURL;
            document.getElementById('logout-button').style.visibility = "visible";
        })
        .catch((error) => {
            console.error('Error during sign-in:', error);
        });
});

// Handle logout
document.getElementById('logout-button').addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('User signed out');
            document.getElementById('login-button').src = "../src/material/account.svg";
            document.getElementById('logout-button').style.visibility = "hidden";
        })
        .catch((error) => {
            console.error('Error during sign-out:', error);
        });
});

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in:', user);
        document.getElementById('login-button').src = user.photoURL;
        document.getElementById('logout-button').style.visibility = "visible";
        // Update UI, show user info, etc.
    } else {
        console.log('No user is signed in');
        document.getElementById('login-button').src = "../src/material/account.svg";
        document.getElementById('logout-button').style.visibility = "hidden";
        // Update UI, show login button, etc.
    }
});
