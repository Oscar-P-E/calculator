const buttons = document.querySelectorAll(".button");
const numberButtons = document.querySelectorAll(".button.number");
const operatorButtons = document.querySelectorAll(".button.operator");
const clearButton = document.querySelector("#clear");
const equalsButton = document.querySelector("#equals");
const display = document.querySelector(".display");
const addBtn = document.querySelector("#add");
const subtractBtn = document.querySelector("#subtract");
const multiplyBtn = document.querySelector("#multiply");
const divideBtn = document.querySelector("#divide");
const posNegBtn = document.querySelector("#pos-neg");
const percentBtn = document.querySelector("#percent");
const zeroBtn = document.querySelector("#zero");

let a = "";
let b = "";
let operator = "";
let register = "aRegister";

clearButton.addEventListener("click", clear);
equalsButton.addEventListener("click", equals);

numberButtons.forEach((btn) => {
  btn.addEventListener("click", hitDigit);
});

function hitDigit(e) {
  if (replaceMode) {
    a = "";
    replaceMode = false;
  }
  // if (register === "aRegister" && e.target.classList.contains("zero")) return;
  storeDigit(e);
}

function storeDigit(e) {
  if (register === "aRegister") {
    if (e.target.classList.contains("zero")) {
      updateDisplay("hitZeroWhenZero");
      return;
    }
    a += "" + e.target.textContent;
    updateDisplay("hitDigit");
    return;
  }
  if (e.target.classList.contains("zero")) {
    updateDisplay("hitZeroWhenZero");
    return;
  }
  b += "" + e.target.textContent;
  updateDisplay("hitDigit");
}

buttons.forEach((btn) => {
  // if (btn.classList.contains("z-span")) {
  // return;
  // }
  btn.addEventListener("click", actuate);
  btn.addEventListener("transitionend", removeActuate);
});

function actuate(e) {
  if (!e.target.classList.contains("z-span")) e.target.classList.add("actuate");
}

function removeActuate(e) {
  if (!e.target.classList.contains("actuate")) return;
  this.classList.remove("actuate");
}

document.addEventListener("click", updateHighlight);

function updateHighlight() {
  if (operator === "add" && register === "bRegister") {
    addBtn.classList.add("highlight");
  } else {
    addBtn.classList.remove("highlight");
  }

  if (operator === "subtract" && register === "bRegister") {
    subtractBtn.classList.add("highlight");
  } else {
    subtractBtn.classList.remove("highlight");
  }

  if (operator === "multiply" && register === "bRegister") {
    multiplyBtn.classList.add("highlight");
  } else {
    multiplyBtn.classList.remove("highlight");
  }

  if (operator === "divide" && register === "bRegister") {
    divideBtn.classList.add("highlight");
  } else {
    divideBtn.classList.remove("highlight");
  }
}

// document.addEventListener()

// operatorButtons.forEach((btn) => {
//   // btn.addEventListener("click", removeHighlight);
//   // btn.addEventListener("click", highlight);
//   btn.addEventListener("click", toggleHighlight);
// });

// function toggleHighlight(e) {
//   e.target.classList.toggle("highlight");
// }

// function removeHighlight(e) {
// if (e.target.classList.contains("highlight")) return 0;
// e.target.classList.remove("highlight");
// }

// function highlight(e) {
// if (e.target.classList.contains("highlight")) return 0;
// e.target.classList.add("highlight");
// }

operatorButtons.forEach((btn) => {
  btn.addEventListener("click", hitOperator);
});

function hitOperator(e) {
  replaceMode = false;
  // We want to evaluate the expression from left to right as we go,
  // "1 + 1 / 2 =" should give us "1" not "1.5"
  if (operator && b) {
    evaluate();
  }
  setOperator(e.target.id);
}

function setOperator(op) {
  operator = op;
  changeRegister("operator");
}

function changeRegister(event) {
  switch (event) {
    case "operator":
      register = "bRegister";
      break;
    case "equals":
    case "clear":
      register = "aRegister";
      break;

    default:
      break;
  }
}

function updateDisplay(context) {
  switch (context) {
    case "hitDigit":
    case "posNeg":
    case "percent":
      if (register === "aRegister") {
        if (a) display.textContent = a;
        return;
      }
      if (b) display.textContent = b;
      else display.textContent = "0";
      break;

    case "evaluate":
      display.textContent = a;
      break;

    case "clear":
    case "hitZeroWhenZero":
      display.textContent = "0";
      break;

    case "divZero":
      display.textContent = "U R DRUNK";
      break;

    default:
      break;
  }
  console.log(a, b, operator, register, replaceMode);
}

function evaluate() {
  // if (register === "aRegister") {
  //   a += "" + digit;
  //   updateDisplay("hitDigit");
  //   return;
  // }
  // b += "" + digit;
  // updateDisplay("hitDigit");
  if (!a) {
    a = 0;
  }
  switch (operator) {
    case "add":
      add();
      break;

    case "subtract":
      subtract();
      break;

    case "multiply":
      multiply();
      break;

    case "divide":
      divide();
      break;

    default:
      break;
  }
  b = "";
  updateDisplay("evaluate");
}

function add() {
  a = Number(a) + Number(b);
  return a;
}

function subtract() {
  a -= b;
  return a;
}

function multiply() {
  a *= b;
  return a;
}

function divide() {
  a = Number(a);
  b = Number(b);
  if (a === 0 || b === 0) {
    divZero();
    return;
  }
  a /= b;
  return a;
}

function clear() {
  a = "";
  b = "";
  operator = "";
  updateDisplay("clear");
  changeRegister("clear");
}

function divZero() {
  clear();
  updateDisplay("divZero");
  // To-do: Display "U R DRUNK"
}

let replaceMode = false;
function equals() {
  if (!operator) {
    return;
  }
  evaluate();
  changeRegister("equals");
  replaceMode = true;
}

posNegBtn.addEventListener("click", posNeg);

function posNeg() {
  if (register === "aRegister") {
    a *= -1;
    updateDisplay("posNeg");
    return;
  }
  b *= -1;
  updateDisplay("posNeg");
}

percentBtn.addEventListener("click", percent);

function percent() {
  if (register === "aRegister") {
    a /= 100;
    updateDisplay("percent");
    return;
  }
  b = b * (a / 100);
  updateDisplay("percent");
}

zeroBtn.addEventListener("click", zeroCheck);

function zeroCheck() {
  if (register === "aRegister" && a) {
    a += "" + "0";
    updateDisplay("hitDigit");
    return;
  }
  if (b) {
    b += "" + "0";
  }
  updateDisplay("hitDigit");
}

/*
 * Accurate rounding
 */
var DecimalPrecision = (function () {
  if (Number.EPSILON === undefined) {
    Number.EPSILON = Math.pow(2, -52);
  }
  if (Math.trunc === undefined) {
    Math.trunc = function (v) {
      return v < 0 ? Math.ceil(v) : Math.floor(v);
    };
  }
  var powers = [
    1, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13,
    1e14, 1e15, 1e16, 1e17, 1e18, 1e19, 1e20, 1e21, 1e22,
  ];
  var intpow10 = function (power) {
    if (power < 0 || power > 22) {
      return Math.pow(10, power);
    }
    return powers[power];
  };
  var isRound = function (num, decimalPlaces) {
    //return decimalPlaces >= 0 &&
    //    +num.toFixed(decimalPlaces) === num;
    var p = intpow10(decimalPlaces);
    return Math.round(num * p) / p === num;
  };
  var decimalAdjust = function (type, num, decimalPlaces) {
    if (type !== "round" && isRound(num, decimalPlaces || 0)) return num;
    var p = intpow10(decimalPlaces || 0);
    var n = num * p * (1 + Number.EPSILON);
    return Math[type](n) / p;
  };
  return {
    // Decimal round (half away from zero)
    round: function (num, decimalPlaces) {
      return decimalAdjust("round", num, decimalPlaces);
    },
    // Decimal ceil
    ceil: function (num, decimalPlaces) {
      return decimalAdjust("ceil", num, decimalPlaces);
    },
    // Decimal floor
    floor: function (num, decimalPlaces) {
      return decimalAdjust("floor", num, decimalPlaces);
    },
    // Decimal trunc
    trunc: function (num, decimalPlaces) {
      return decimalAdjust("trunc", num, decimalPlaces);
    },
    // Format using fixed-point notation
    toFixed: function (num, decimalPlaces) {
      return decimalAdjust("round", num, decimalPlaces).toFixed(decimalPlaces);
    },
  };
})();

// test rounding of half
console.log(DecimalPrecision.round(0.5) === 1); // 1
console.log(DecimalPrecision.round(-0.5) === -1); // -1

// testing very small numbers
console.log(DecimalPrecision.ceil(1e-8, 2) === 0.01);
console.log(DecimalPrecision.floor(1e-8, 2) === 0);

// testing simple cases
console.log(DecimalPrecision.round(5.12, 1) === 5.1);
console.log(DecimalPrecision.round(-5.12, 1) === -5.1);
console.log(DecimalPrecision.ceil(5.12, 1) === 5.2);
console.log(DecimalPrecision.ceil(-5.12, 1) === -5.1);
console.log(DecimalPrecision.floor(5.12, 1) === 5.1);
console.log(DecimalPrecision.floor(-5.12, 1) === -5.2);
console.log(DecimalPrecision.trunc(5.12, 1) === 5.1);
console.log(DecimalPrecision.trunc(-5.12, 1) === -5.1);

// testing edge cases for round
console.log(DecimalPrecision.round(1.005, 2) === 1.01);
console.log(DecimalPrecision.round(39.425, 2) === 39.43);
console.log(DecimalPrecision.round(-1.005, 2) === -1.01);
console.log(DecimalPrecision.round(-39.425, 2) === -39.43);

// testing edge cases for ceil
console.log(DecimalPrecision.ceil(9.13, 2) === 9.13);
console.log(DecimalPrecision.ceil(65.18, 2) === 65.18);
console.log(DecimalPrecision.ceil(-2.26, 2) === -2.26);
console.log(DecimalPrecision.ceil(-18.15, 2) === -18.15);

// testing edge cases for floor
console.log(DecimalPrecision.floor(2.26, 2) === 2.26);
console.log(DecimalPrecision.floor(18.15, 2) === 18.15);
console.log(DecimalPrecision.floor(-9.13, 2) === -9.13);
console.log(DecimalPrecision.floor(-65.18, 2) === -65.18);

// testing edge cases for trunc
console.log(DecimalPrecision.trunc(2.26, 2) === 2.26);
console.log(DecimalPrecision.trunc(18.15, 2) === 18.15);
console.log(DecimalPrecision.trunc(-2.26, 2) === -2.26);
console.log(DecimalPrecision.trunc(-18.15, 2) === -18.15);

// testing round to tens and hundreds
console.log(DecimalPrecision.round(1262.48, -1) === 1260);
console.log(DecimalPrecision.round(1262.48, -2) === 1300);

// testing toFixed()
console.log(DecimalPrecision.toFixed(1.005, 2) === "1.01");
