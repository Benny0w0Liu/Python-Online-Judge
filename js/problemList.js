//Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

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
// pagination
let data = [];
function displayTable() {
    const table = document.getElementById("ProblemTable");
    // Clear existing table rows 
    table.innerHTML = ` 
        <tr> 
            <td class="tablehead">#</td>
            <th class="tablehead">Title</th>
            <td class="tablehead">Status</td>
        </tr> 
    `;
    // Add new rows to the table 
    for (var i = 0; i < data.length; i++) {
        var row = document.createElement("tr");
        row.innerHTML = `
    <td onclick="window.open('../pages/problem.html?problem=${data[i].id}')">${data[i].id}</td>
    <th onclick="window.open('../pages/problem.html?problem=${data[i].id}')">${data[i].title}</th>
    <td onclick="window.open('../pages/problem.html?problem=${data[i].id}')">${data[i].status}</td>        
        `
        table.appendChild(row);
    }
}

//database
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

get(child(dbRef, `Problems`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            Object.entries(snapshot.val()).forEach(([key, value]) => {
                data.push({ id: key, title: value.title, status: "unsolved" })
            });
            for (var i = 0; i < data.length; i++) {
                if (passProblem.includes(data[i].id)) {
                    data[i].status = "solved"
                }
            }
            displayTable();
            const ctx = document.getElementById('myDonutChart').getContext('2d');
            var solved = passProblem.length - 1, unsolved = data.length - (passProblem.length - 1);
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['solved', 'unsolved'],
                    datasets: [{
                        data: [solved, unsolved],
                        backgroundColor: ['#4285F4', '#F4B400'],
                    }],
                }, options: {
                    maintainAspectRatio: false,
                }
            });
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });

document.getElementById("SearchInput").addEventListener("keyup", function () {
    var exist = false;
    var input, filter, txtValue;
    input = document.getElementById("SearchInput");
    filter = input.value.toUpperCase();
    const table = document.getElementById("ProblemTable");
    table.innerHTML = ` 
        <tr> 
            <td class="tablehead">#</td>
            <th class="tablehead">Title</th>
            <td class="tablehead">Status</td>
        </tr> 
    `;;
    for (var i = 0; i < data.length; i++) {
        if (data[i]) {
            txtValue = JSON.stringify(data[i]);
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                var row = document.createElement("tr");
                row.innerHTML = `
    <td onclick="window.location.href('../pages/problem.html?problem=${data[i].id}')">${data[i].id}</td>
    <th onclick="window.location.href('../pages/problem.html?problem=${data[i].id}')">${data[i].title}</th>
    <td onclick="window.location.href('../pages/problem.html?problem=${data[i].id}')">${data[i].status}</td>        
        `
                table.appendChild(row);
                exist = true;
            }
        }
    }
    if (!exist) {
        displayTable();
    }
})
document.getElementById("sort_by_alpha").addEventListener("click", function () {

    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("ProblemTable");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TH")[0];
            y = rows[i + 1].getElementsByTagName("TH")[0];
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
})
document.getElementById("sort_by_id").addEventListener("click", function () {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("ProblemTable");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[0];
            y = rows[i + 1].getElementsByTagName("TD")[0];
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
})
