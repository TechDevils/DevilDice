var rpi = require('arrayrandompicker');
var rs = require('arraysummary')();

class DevilDice{
    constructor(){
        this.ds = [];
        this.mode = 0;
        this.addDice(6);
        this.showDice();
    }

    rollAllDice(rollXTimes, withIndex) {
        return this.roll(this.ds, rollXTimes, withIndex, false);
    }
    rollAllDiceWithStats(rollXTimes) {
        return this.roll(this.ds, rollXTimes, false, true);
    }

    rollDiceOf(size, times) {
        var dice = this.addDice(size, true);
        return this.roll(dice, times, false, false);
    }

    roll(dices, rollXTimes, withIndex,withStats) {
        if(this.mode == 1){
            var diceNames = [];
            for (let d = 0; d < dices.length; d++) {
                const currentDice = dices[d];
                diceNames.push(getDiceName(currentDice));
            }
            logMessage(`Rolling ${dices.length} dice (${diceNames}) x ${rollXTimes} times`);
        }
        if (!dices) {
            dices = [...this.ds];
        }
        if (dices.length == 0) {
            logMessage("No dice to roll");
            return [];
        }
        if (!rollXTimes) {
            rollXTimes = 1;
        }
        var rolls = [];
        for (let i = 0; i < dices.length; i++) {
            const dice = dices[i];
            rolls.push([...rpi.selectManyRepeatingRandomArrayItems(dice, rollXTimes, withIndex)]);

        }

        var outcome = [];

        for (let i = 0; i < rollXTimes; i++) {
            var rollGroups = [];
            for (let ii = 0; ii < rolls.length; ii++) {
                const element = rolls[ii][i];
                rollGroups.push(element);
            }

            if(this.mode == 0){
                outcome.push([...rollGroups]);
            }
            else if (this.mode == 1){
                var diceResultItem = {
                    "key" : `roll_${i}`,
                    "result" : [...rollGroups],
                    "stats" : {}
                    }

                var currentRollStats = rollStats(diceResultItem.result);
                diceResultItem.stats = currentRollStats;
                outcome.push(diceResultItem) ;
            }
            
        }
        if(withStats){
            var allRollsNumbers = [];
            for (let i = 0; i < outcome.length; i++) {
                const item = outcome[i];
                if(this.mode == 0){
                    allRollsNumbers = [...allRollsNumbers,...item];
                }else if(this.mode == 1){
                    allRollsNumbers = [...allRollsNumbers,...item.result];
                }
            }
            var stats = rs.processData('all dice',allRollsNumbers);
            outcome.push(stats);
        }
        logMessage(JSON.stringify(outcome));
        return outcome;
    }

    addDice(newDiceNumbers, dontAddToStore) {

        var output = [];
        if(Array.isArray(newDiceNumbers)){
            for (let i = 0; i < newDiceNumbers.length; i++) {
                const currentDiceSize = newDiceNumbers[i];
                var newDice = createDiceOfSides(currentDiceSize);
                output.push(newDice);
                if (!dontAddToStore) {
                    logMessage(`Adding new dice ${getDiceName(newDice)}`);
                    this.ds.push([...newDice]);
                }
            }
        }else{
            var newDice = createDiceOfSides(newDiceNumbers);
            output.push(newDice);
            if (!dontAddToStore) {
                logMessage(`Adding new dice ${getDiceName(newDice)}`);
                this.ds.push([...newDice]);
            }
        }

        return output;
    }

    removeDice(key) {
        var deleted = this.ds.splice(key,1);
        logMessage(`Removed ${getDiceName(deleted[0])}`)
    }

    clearStoredDice() {
        this.ds.length = 0;
    }

    showDice() {
        var diceOutput = {"dice" :[],"collection" : {}};

        for (let i = 0; i < this.ds.length; i++) {
            const dice = this.ds[i];
            var diceName = getDiceName(dice);
            diceOutput["dice"].push({"key" : i, "dice":diceName });

            if(diceOutput["collection"][diceName]){
                diceOutput["collection"][diceName]++;
            }else{
                diceOutput["collection"][diceName] = 1;
            }
        }

        if(this.mode == 0){
            logMessage(JSON.stringify(diceOutput.collection));
        }
        else if(this.mode == 1){
            logMessage(JSON.stringify(diceOutput));
        }
        
    }
}

module.exports = DevilDice;

/* "Private" functions */

function createDiceOfSides(number){
    var newDice = [];
    for (let i = 0; i < number; i++) {
        newDice.push(i + 1);
    }
    return newDice;
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

function getDiceName(dice){
    return `d${dice.length}`;
}
function rollStats(results){
    var rollStatsOutput = {
        "total" : 0,
        "min" : 0,
        "max" : 0,
        "mean" : 0,
        "mode" : 0,
        "count" : 0
    };

    var numbers = rs.processData("dice",results);

    rollStatsOutput.min = numbers.min;
    rollStatsOutput.max = numbers.max;
    rollStatsOutput.mode = numbers.mode;
    rollStatsOutput.mean = numbers.mean;
    rollStatsOutput.median = numbers.median;
    rollStatsOutput.count = numbers.count;
    rollStatsOutput.total = numbers.total;
    rollStatsOutput.standardDeviation = numbers.standardDeviation;
    rollStatsOutput.quartile = numbers.quartile;

    return rollStatsOutput;
}

//ToDo : Roll history (default 10 rolls)
//ToDo : Roll history stats
