//Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";


const firebaseConfig = {
    //firebase Configs
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
            document.getElementById("submitBtn").style.visibility = "visible";
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
            document.getElementById("submitBtn").style.visibility = "hidden";
            alert("haven't log in yet, please log in")
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
        document.getElementById("submitBtn").style.visibility = "visible";
        // Update UI, show user info, etc.
    } else {
        console.log('No user is signed in');
        document.getElementById('login-button').src = "../src/material/account.svg";
        document.getElementById('logout-button').style.visibility = "hidden";
        document.getElementById("submitBtn").style.visibility = "hidden";
        alert("haven't log in yet, please log in")
        // Update UI, show login button, etc.
    }
});
// code area
let editor = ace.edit("editor");
let defaultCode = 'print("Hello World!")';

let editorLib = {
    init() {
        editor.setTheme("ace/theme/dreamweaver");
        editor.session.setMode("ace/mode/python");
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
        });
        editor.setValue(defaultCode);
    }
}
editorLib.init();
//upload file
document.getElementById("fileSelect").addEventListener(
    "click",
    function (e) {
        if (document.getElementById("fileElem")) {
            document.getElementById("fileElem").click();
        }
    },
    false,
);
document.getElementById('fileElem').onchange = function () {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function (progressEvent) {
        console.log(this.result);
        editor.setValue(this.result);
    };
    reader.readAsText(file);
};
document.getElementById("editorContent").onchange = function () {
    console.log("test")
    if (document.getElementById("editorContent").innerHTML == "PASS") {
        console.log("congradulation")
    }
}
//get url id
var url = location.href;
var id = "";
if (url.indexOf('?') != -1) {
    var ary = url.split('?')[1].split('&');
    for (var i = 0; i <= ary.length - 1; i++) {
        if (ary[i].split('=')[0] == 'problem')
            id = ary[i].split('=')[1];
    }
}
const dbRef = ref(getDatabase());
var keys = Object.keys(localStorage), i = keys.length;
var passProblem, email;
while (i--) {
    if (keys[i].indexOf("firebase:authUser") > -1) {
        email = JSON.parse(localStorage.getItem(keys[i])).email
    }
}

get(child(dbRef, `Users/${email.replaceAll('.', '!')}`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            passProblem = snapshot.val().passProblem;
        } else {
            alert("you aren't in the user list please fill in the form in the home page:D");
            window.location.href = "../index.html";
        }
    })
    .catch((error) => {
        console.error(error);
    });
get(child(dbRef, `Problems/${id}`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            document.getElementById("description").innerHTML = snapshot.val().description;
            editor.setValue(snapshot.val().defaultCode);
        } else {
            window.location.replace("../pages/problemList.html");
        }
    })
    .catch((error) => {
        console.error(error);
    });
// submit
document.getElementById("editorContent").addEventListener("click", function () {
    if (document.getElementById("editorContent").innerHTML == '<div style="padding: 10px;">Congratulation! Click here to update your record!</div>') {
        if (!passProblem.includes(id)) {
            passProblem.push(id)
            set(ref(getDatabase(app), 'Users/' + email.replaceAll('.', '!')), {
                userEmail: email,
                passProblem: passProblem
            })
                .then(() => {
                    console.log("Data saved successfully!");
                })
                .catch((error) => {
                    console.error("Data could not be saved: " + error);
                });
        }
        window.open("../pages/problemList.html")
    }
})
document.getElementById("submitBtn").addEventListener("click", async function () {
    await get(child(dbRef, `Problems/${id}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                var obj = snapshot.val();
                document.getElementById("console").innerHTML = "";
                var PythonStyle = `
from js import document
document.querySelector(".py-terminal-docked").style.height = "0px"
document.querySelector("html").style.padding = "0px"
document.querySelector("button").style.margin = "10px"
`
                var py_code = PythonStyle + editor.getValue() + obj.suffixCode;
                console.log(py_code)
                var py_div;

                var py_output = document.createElement("div");
                py_output.id = "consoleContent";
                document.getElementById("console").appendChild(py_output);
                if (py_div) {
                    py_div.remove();
                }
                let html_tag = `
<py-script output="${py_output.id}">
${py_code}
</py-script>
`;
                let div = document.createElement("div");
                div.innerHTML = html_tag;

                py_div = div.firstElementChild;
                document.getElementById("console").appendChild(py_div);


            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            console.error(error);
        });
});