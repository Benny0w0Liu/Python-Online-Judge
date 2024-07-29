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
            var keys = Object.keys(localStorage), i = keys.length;
            var email;
            while (i--) {
                if (keys[i].indexOf("firebase:authUser") > -1) {
                    email = JSON.parse(localStorage.getItem(keys[i])).email
                }
            }
            const dbRef = ref(getDatabase());
            get(child(dbRef, `Administrator/${email.replaceAll('.', '!')}`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        console("are Administrator")
                    } else {
                        alert("you aren't in the user list please fill in the form in the home page:D");
                        window.location.href = "../index.html";
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
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
        var keys = Object.keys(localStorage), i = keys.length;
        var email;
        while (i--) {
            if (keys[i].indexOf("firebase:authUser") > -1) {
                email = JSON.parse(localStorage.getItem(keys[i])).email
            }
        }
        const dbRef = ref(getDatabase());
        get(child(dbRef, `Administrator/${email.replaceAll('.', '!')}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    console("are Administrator")
                } else {
                    alert("you aren't in the user list please fill in the form in the home page:D");
                    window.location.href = "../index.html";
                }
            })
            .catch((error) => {
                console.error(error);
            });
        // Update UI, show user info, etc.
    } else {
        console.log('No user is signed in');
        document.getElementById('login-button').src = "../src/material/account.svg";
        document.getElementById('logout-button').style.visibility = "hidden";
        // Update UI, show login button, etc.
    }
});

//database
const db = getDatabase(app);
// Function to write user data
function writeUserData(email, passProblem) {
    var userId = email.replaceAll('.', '!');
    set(ref(db, 'Users/' + userId), {
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
function writeAdministratorData(email) {
    var userId = email.replaceAll('.', '!');
    set(ref(db, 'Administrator/' + userId), {
        userEmail: email
    })
        .then(() => {
            console.log("Data saved successfully!");
        })
        .catch((error) => {
            console.error("Data could not be saved: " + error);
        });
}
function writeProblemData(ProblemId, title, description, suffixCode, defaultCode) {
    set(ref(db, 'Problems/' + ProblemId), {
        title: title,
        description: description,
        defaultCode: defaultCode,
        suffixCode: suffixCode
    })
        .then(() => {
            console.log("Data saved successfully!");
        })
        .catch((error) => {
            console.error("Data could not be saved: " + error);
        });
}
// Function to read user data
function readUserData(userId) {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `Users/${userId}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            console.error(error);
        });
}
function readProblemData(problemId) {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `Problems/${problemId}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            console.error(error);
        });
}
// Event listeners
document.getElementById('write-button').addEventListener('click', () => {
    writeUserData("bennyliu9005@gmail.com", ["0"]);
});
document.getElementById('write-administrator').addEventListener('click', () => {
    writeAdministratorData("nsysu.gdsc@gmail.com");
});
document.getElementById('read-button').addEventListener('click', () => {
    readUserData('bennyliu9005@gmail!com');
});
document.getElementById('write-problem').addEventListener('click', () => {
    writeProblemData("0", "Test", `<h1>plus 1</h1>
            <h2 id="DescriptionTitle">Description</h2>
            <div id="Questiondescription" class="descriptionContent">
                given an variable x, please add 1 to x
            </div>
            <h2 id="ExampleTitle">Example</h2>
            <div id="Example" class="descriptionContent">
                <ul>
                    <li>
                        input:
                        <div class="example">x=1</div>
                        output:
                        <div class="example">2</div>
                    </li>
                    <li>
                        input:
                        <div class="example">x=10</div>
                        output:
                        <div class="example">11</div>
                    </li>
                </ul>
            </div>`, `
def answer(n):
    x=n
    x=x+1
    return x
def score():
    result = True
    for i in range(10):
        if(PlusOne(i)==answer(i)):
            print("Case",(i+1)," : success")
        else:
            print("Case",(i+1)," : failed")
            result = False
    return result
if(score()):
    newScript = document.createElement("div");
    newScript.style.padding="10px"
    newScript.innerHTML = "Congratulation! Click here to update your record!"
    document.getElementById("editorContent").append(newScript);
    print("PASS")
else:
    print("FAILED")
`, `def PlusOne(n):
    x=n
    # your code
    return x
`)
});
document.getElementById('read-problem').addEventListener('click', () => {
    readProblemData('1');
});

