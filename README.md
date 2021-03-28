# Devil Dice

Roll the dice a simple dice roller. Nothing over the top just roll.

## The basics 
The code will auto load in a d6 dice.

### roll

```
var dd = require("devildice");

dd.roll();

//output : {"roll_0":[4]}
```

### add die

```
var dd = require("devildice");

dd.addDice(20);

dd.roll();

//output : {"roll_0":[3,13]}
```

### clear dice

```
var dd = require("devildice");

dd.clearStoredDice();

dd.roll();

//output : No dice to roll
```

### show dice

```
var dd = require("devildice");

dd.addDice(20);
dd.addDice(10);
dd.addDice(3);


dd.showDice();

//output : {"dice":[{"key":0,"die":[1,2,3,4,5,6]},{"key":1,"die":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]},{"key":2,"die":[1,2,3,4,5,6,7,8,9,10]},{"key":3,"die":[1,2,3]}]}
```

### remove dice

```
var dd = require("devildice");

dd.addDice(20);
dd.addDice(10);
dd.addDice(3);

//Use the key from dd.showDice();
// in this case 2 would be the  key for the d10
dd.removeDice(2);

//output : {"dice":[{"key":0,"die":[1,2,3,4,5,6]}]}
```