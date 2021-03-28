var rpi = require('arrayrandompicker');
var ds = [];

addDice(6);
showDice();

function rollAllDice(rollXTimes, withIndex) {
    return roll(ds, rollXTimes, withIndex);
}

function rollDiceOf(size, times) {
    var dice = addDice(size, true);
    var dices = [dice];
    return roll(dices, times);
}

function roll(dices, rollXTimes, withIndex) {
    if (!dices) {
        dices = [...ds];
    }
    if (dices.length == 0) {
        logMessage("No dice to roll");
        return {};
    }
    if (!rollXTimes) {
        rollXTimes = 1;
    }
    var rolls = [];
    for (let i = 0; i < dices.length; i++) {
        const dice = dices[i];
        rolls.push([...rpi.selectManyRepeatingRandomArrayItems(dice, rollXTimes, withIndex)]);

    }

    var outcome = {};

    for (let i = 0; i < rollXTimes; i++) {
        var rollGroups = [];
        for (let ii = 0; ii < rolls.length; ii++) {
            const element = rolls[ii][i];
            rollGroups.push(element);
        }
        outcome[`roll_${i}`] = [...rollGroups];
    }
    logMessage(outcome);
    return outcome;
}

function addDice(sides, dontAddToStore) {
    var newDice = []
    for (let i = 0; i < sides; i++) {
        newDice.push(i + 1);
    }
    if (!dontAddToStore) {
        ds.push([...newDice]);
    }

    return newDice;
}

function removeDice(key) {
    ds.splice(key,1);
}

function clearStoredDice() {
    ds.length = 0;
}

function showDice() {
    var diceOutput = {"dice" :[]};

    for (let i = 0; i < ds.length; i++) {
        const die = ds[i];
        diceOutput["dice"].push({"key" : i, "die":die });
    }

    logMessage(JSON.stringify(diceOutput));
}

function logMessage(msg) {
    var currentTime = new Date();
    var month = `00${currentTime.getUTCMonth()+1}`.substr(-2);
    var day = `00${currentTime.getUTCDate()}`.substr(-2);
    var hour = `00${currentTime.getUTCHours()}`.substr(-2);
    var min = `00${currentTime.getUTCMinutes()}`.substr(-2);
    var sec = `00${currentTime.getUTCSeconds()}`.substr(-2);
    var ms = `000${currentTime.getUTCMilliseconds()}`.substr(-3);
    var formattedDateTime = `${currentTime.getUTCFullYear()}-${month}-${day} ${hour}:${min}:${sec}.${ms}`;
    console.log(`${formattedDateTime} : ${msg}`);
}

module.exports = {
    rollAllDice,
    addDice,
    rollDiceOf,
    roll,
    clearStoredDice,
    showDice,
    removeDice
}