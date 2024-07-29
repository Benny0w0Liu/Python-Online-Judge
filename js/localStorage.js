function allStorage() {
    var values = [
    ],
        keys = Object.keys(localStorage),
        i = keys.length;

    while (i--) {
        if (keys[i].indexOf("firebase:authUser") > -1) {
            var obj = {
                key: keys[i],
                value: localStorage.getItem(keys[i])
            }
            values.push(obj);
        }
    }
    return values;
}
let storage = allStorage();
function reSetStorage(storage) {
    console.log(storage)
    for (var i = 0; i < storage.length; i++) {
        localStorage.setItem(storage[i].key, storage[i].value);
    }
}
console.log(allStorage());
window.addEventListener("DOMContentLoaded", function () {
    reSetStorage(storage);
});