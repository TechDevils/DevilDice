var rpi = require('arrayrandompicker');
var ds = [];

addDice(6);
showDice();

class DevilDice{
rollAllDice(rollXTimes, withIndex) {
    return roll(ds, rollXTimes, withIndex);
}

rollDiceOf(size, times) {
    var dice = addDice(size, true);
    var dices = [dice];
    return roll(dices, times);
}

roll(dices, rollXTimes, withIndex) {
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
    logMessage(JSON.stringify(outcome));
    return outcome;
}

addDice(sides, dontAddToStore) {
    var newDice = []
    for (let i = 0; i < sides; i++) {
        newDice.push(i + 1);
    }
    if (!dontAddToStore) {
        ds.push([...newDice]);
    }

    return newDice;
}

removeDice(key) {
    ds.splice(key,1);
}

clearStoredDice() {
    ds.length = 0;
}

showDice() {
    var diceOutput = {"dice" :[]};

    for (let i = 0; i < ds.length; i++) {
        const die = ds[i];
        diceOutput["dice"].push({"key" : i, "die":die });
    }

    logMessage(JSON.stringify(diceOutput));
}

logMessage(msg) {
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

// module.exports = {
//     rollAllDice,
//     addDice,
//     rollDiceOf,
//     roll,
//     clearStoredDice,
//     showDice,
//     removeDice
// }
}

module.exports = DevilDice;


//ToDo : Change dice output in min mode to array of arrays.
//ToDo : Change dice output in verbose mode object with value of dice with to array of arrays.
//ToDo : Change dice output in verbose mode object with value of dice with to array of arrays.
//ToDo : Change dice output in verbose mode object with stats min max mean total of roll.
//ToDo : show dice output as in min or verbose level
//ToDo : at min show dice as 3d6 or 1d6 or 1d4 1d10 2d20
//ToDo : as verbose show dice as 3 dice with 6 sides etc etc
//ToDo : as verbose show dice as 3 dice with 6 sides etc etc
//ToDo : add log message on roll. also check messages on other methods
//ToDo : change if roll with no dice log message but return empty array of object or error
//ToDo : don't use private fields as not widely supported
//ToDo : check class and private fields work with webpack for web pages
//ToDo : Add multiple dice by passing and array to the add method
