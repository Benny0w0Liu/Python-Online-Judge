//Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

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
editor.getSession().on('change', function () {
    document.getElementById("editorContent").innerHTML = editor.getValue();
});
//python
document.getElementById("editorContent").innerHTML = `print("Hello World")`
document.getElementById("runBtn").addEventListener("click", function () {
    var PythonStyle = `
from js import document
document.querySelector(".py-terminal-docked").style.height = "0px"
document.querySelector("html").style.padding = "0px"
`
    pyRun("console", editor.getValue() + PythonStyle);

})
function pyRun(divID, Code) {
    document.getElementById(divID).innerHTML = "";

    var py_code = Code;
    var py_div;

    var py_output = document.createElement("div");
    py_output.id = "consoleContent";
    document.getElementById(divID).appendChild(py_output);
    if (py_div) {
        py_div.remove();
    }
    let html_tag = `
<py-script output="${py_output.id}" id="pyscript">
${py_code}
</py-script>
`;

    let div = document.createElement("div");
    div.innerHTML = html_tag;

    py_div = div.firstElementChild;
    document.getElementById(divID).appendChild(py_div);
}
//UploadFile
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

