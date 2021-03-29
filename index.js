var rpi = require('arrayrandompicker');

class DevilDice{
    constructor(){
        this.ds = [];
        this.mode = 0;
        this.addDice(6);
        this.showDice();
    }

    rollAllDice(rollXTimes, withIndex) {
        return this.roll(this.ds, rollXTimes, withIndex);
    }

    rollDiceOf(size, times) {
        var dice = addDice(size, true);
        var dices = [dice];
        return this.roll(dices, times);
    }

    roll(dices, rollXTimes, withIndex) {
        if (!dices) {
            dices = [...this.ds];
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
        logMessage(JSON.stringify(outcome));
        return outcome;
    }

    addDice(sides, dontAddToStore) {
        var newDice = []
        for (let i = 0; i < sides; i++) {
            newDice.push(i + 1);
        }
        if (!dontAddToStore) {
            this.ds.push([...newDice]);
        }

        return newDice;
    }

    removeDice(key) {
        this.ds.splice(key,1);
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

    var numbers = processData("dice",results);

    rollStatsOutput.min = numbers.min;
    rollStatsOutput.max = numbers.max;
    rollStatsOutput.mode = numbers.mode;
    rollStatsOutput.mean = numbers.mean;
    rollStatsOutput.count = numbers.count;
    rollStatsOutput.total = numbers.total;

    return rollStatsOutput;
}
function processData(name, numbers)
{
	let output = {
		name : name,
		min : undefined,
		max : undefined,
		mean : undefined,
		median : undefined,
		mode : undefined,
		range : undefined,
		count : undefined,
        total : undefined
	}
	
    numbers = numbers.sort((a,b) => {return b - a});

    output.total = getTotal(numbers);

	output.count = numbers.length;
	var minMax = getMinAndMaxFromInts(numbers);
	output.max = minMax.max;
	output.min = minMax.min;
	output.range = output.max - output.min;
	if(isNaN(output.range)){
		output.range = undefined;
	}
	var mean = getAverage(numbers);
	output.mean = mean;

	var quantiles = getQuartiles(numbers);
	output.median = quantiles.median;
	output.q1 = quantiles.q1;
	output.q3 = quantiles.q3;

	var mode = getMostCommon(numbers);
	output.mode = mode.top;
	output.modeValues = mode.allValues;
	//console.dir(output);

	var outputKeys = Object.keys(output);

	for (let k = 0; k < outputKeys.length; k++) {
		const key = outputKeys[k];
		if(output[key] == undefined)
		{
			delete output[key];
		}
	}

	return output;
}

function getMinAndMaxFromInts(input){
    var output = {max: input[0], min: input[input.length-1] };
    return output;
}
function getAverage(input){
	var total = input.reduce((a,cv) => a + cv);
	var output = total / input.length;
	if(isNaN(output)){
		return undefined;
	}
    return output;
}
function getQuartiles(input){
	var middleArrayValue = Math.floor(input.length / 2);
	var output = {};
	if(input.length % 2 == 0){
		var leftMiddle = input[middleArrayValue -1];
		var rightMiddle = input[middleArrayValue];
		output.median = (leftMiddle + rightMiddle) / 2;
	}
	else{
		output.median = input[middleArrayValue];
	}
    return output;
}
function getMostCommon(input){
	var values = {};
	for (let i = 0; i < input.length; i++) {
		const number = input[i];
		if(values[number]){
			values[number] += 1;
		}
		else{
			values[number] = {};
			values[number] = 1;
		}
	}	
	var keys = Object.keys(values);
	var top = undefined;
	var maxCount = 0;
	for (let k = 0; k < keys.length; k++) {
		let key = keys[k];
		const checkValue = values[key];
		if(checkValue == 1){
			continue;
		}
		if(checkValue > maxCount){
			top = key;
			maxCount = checkValue;
		}
	}
	var output = {};
	output["allValues"] = values;
	output["top"] = top;

    return output;
}

function getTotal(input){
    return input.reduce((p,c,i) => {return p += c;})
}



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
//ToDo : Make Array summary a mpn module
