"use strict";
//https://basarat.gitbooks.io/algorithms/content/docs/shuffling.html
function shuffle(array) {
    // if it's 1 or 0 items, just return
    if (array.length <= 1)
        return array;
    // For each index in array
    for (var i = 0; i < array.length; i++) {
        // choose a random not-yet-placed item to place there
        // must be an item AFTER the current item, because the stuff
        // before has all already been placed
        var randomChoiceIndex = getRandom(i, array.length - 1);
        // place our random choice in the spot by swapping
        _a = [array[randomChoiceIndex], array[i]], array[i] = _a[0], array[randomChoiceIndex] = _a[1];
    }
    return array;
    var _a;
}
exports.shuffle = shuffle;
function getRandom(floor, ceiling) {
    return Math.floor(Math.random() * (ceiling - floor + 1)) + floor;
}
//# sourceMappingURL=utils.js.map