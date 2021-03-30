# Devil Dice

Roll the dice a simple dice roller. Nothing over the top just roll.

## The basics 
The code will auto load in a d6 dice.

### roll

```
const DevilDice = require("devildice");
var dd = new DevilDice;

dd.roll();

//output : [[2]]
```

### add dice

```
const DevilDice = require("devildice");
var dd = new DevilDice;

dd.addDice(20);

dd.roll();

//output : [[2,19]]
```

### clear dice

```
const DevilDice = require("devildice");
var dd = new DevilDice;

dd.clearStoredDice();

dd.roll();

//output : []
```

### show dice

```
const DevilDice = require("devildice");
var dd = new DevilDice;

dd.addDice(20);
dd.addDice(10);
dd.addDice(10);


dd.showDice();

//output : {"d6":1,"d10":2,"d20":1}
```

### remove dice

```
const DevilDice = require("devildice");
var dd = new DevilDice;

dd.addDice(20);
dd.addDice(10);
dd.addDice(3);

//Use the key from dd.showDice();
// in this case 2 would be the  key for the d10
dd.removeDice(2);

```

## Advanced dice

### Add multiple

```
const DevilDice = require("devildice");
var dd = new DevilDice;
dd.addDice([10,20,7,8])
```

### Roll All Dice

```
const DevilDice = require("devildice");
var dd = new DevilDice;

dd.addDice(20);
dd.addDice(10);
dd.addDice(3);
dd.addDice(3);

dd.rollAllDice();

//output : [[10,5,3,2]]
```
Roll them x number of times (remember that by default a d6 is added so the first dice unless cleared is a d6)
```
const DevilDice = require("devildice");
var dd = new DevilDice;

dd.addDice(20);
dd.addDice(10);
dd.addDice(3);
dd.addDice(3);

dd.rollAllDice(6);

//output : [[2,17,1,3],[5,11,3,3],[10,5,1,1],[9,5,1,1],[2,2,2,3],[4,1,3,2]]
```

### Mode 

The mode can be change to have a greater details 
```
const DevilDice = require("devildice");
var dd = new DevilDice;

dd.addDice([10,20,6])

dd.mode = 1;
dd.rollAllDiceWithStats(3);

//output : [{"key":"roll_0","result":[4,5,6,4],"stats":{"total":19,"min":4,"max":6,"mean":4.75,"mode":4,"median":4.5,"standardDeviation":0.9574271077563381}},{"key":"roll_1","result":[2,15,6,2],"stats":{"total":25,"min":2,"max":15,"mean":6.25,"mode":2,"median":4,"standardDeviation":6.1305247192498395}},{"key":"roll_2","result":[4,5,1,4],"stats":{"total":14,"min":1,"max":5,"mean":3.5,"mode":4,"median":4,"standardDeviation":1.7320508075688772}},{"name":"all dice","min":1,"max":15,"mean":4.833333333333333,"median":4,"mode":4,"total":58,"standardDeviation":3.563280749108846,"size":12,"variance":12.696969696969697}]

dd.mode = 0;
dd.rollAllDiceWithStats(3);

//output : [[8,18,6,1],[10,9,6,3],[10,15,5,2],{"name":"all dice","min":1,"max":18,"mean":7.749999999999999,"median":7,"mode":10,"total":93,"standardDeviation":5.083395429327635,"size":12,"variance":25.840909090909093}]
```


if you like check the rest of my projects at https://github.com/TechDevils
and maybe checkout
[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/M4M31JOPH)