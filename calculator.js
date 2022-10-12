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
const decimalBtn = document.querySelector("#decimal");

let a = "";
let b = "";
let operator = "";
let register = "aRegister";

const maxDisplayDigits = 9;

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
  // length of "a" not including the negative symbol or the decimal point
  // if (String(Math.abs(Number(a))).replace(".", "").length <= maxDisplayDigits) {
  storeDigit(e);
  // }
}

function storeDigit(e) {
  if (register === "aRegister") {
    if (e.target.classList.contains("zero")) {
      updateDisplay("hitZeroWhenZero");
      return;
    }
    // processedText = fitToMax(
    //   Number(text),
    //   calcMaxDecimalLength(text, maxDisplayDigits)
    // );
    // if (
    //   String(Number(processedText)).replace(".", "").replace("-", "").length >
    //   maxDisplayDigits
    // ) {
    //   processedText = DecimalPrecision.round(
    //     Number(processedText),
    //     -1
    //   ).toExponential();
    // a =
    // String(fitToMax(Number(a), calcMaxDecimalLength(a, maxDisplayDigits))) +
    // e.target.textContent;
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
// let rounded =  DecimalPrecision.round(input, maxDecimalLength);
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

decimalBtn.addEventListener("click", storeDecimal);

function storeDecimal() {
  // placeholder 2
  if (register === "aRegister") {
    if (!a) {
      a = "0";
    }
    if (!a.match(/\./g)) {
      a += "" + ".";
    }
  } else {
    // register === "bRegister"
    if (!b) {
      b = "0";
    }
    if (!b.match(/\./g)) {
      b += "" + ".";
    }
  }
}

/*
 * Accurate rounding
 */
var DecimalPrecision = (function decimalPrecision() {
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

function calcMaxDecimalLength(num, maxLength) {
  // "-987654.321"
  // remove neg, remove decimal numbers and dot
  const nonDecimalDigits = String(Math.floor(Math.abs(Number(num)))).length;
  return maxLength - nonDecimalDigits;
}

function fitToMax(input, maxDecimalLength) {
  // const digits = String(input).replace(".", "").length;
  // if (digits > maxDisplayDigits) {
  // return DecimalPrecision.trunc(input, maxDecimalLength);
  // processedText = Number(text).toExponential();
  // }
  // let rounded =  DecimalPrecision.round(input, maxDecimalLength);
  // if (String(Math.abs(rounded).replace".", "" )
  return DecimalPrecision.round(input, maxDecimalLength);
}

function updateDisplay(context) {
  function setDisplay(text) {
    // const digits = String(text).replace(".", "").length;
    let processedText;
    // if (digits > maxDisplayDigits) {

    // processedText = Number(text).toExponential();
    // } else {
    processedText = fitToMax(
      Number(text),
      calcMaxDecimalLength(text, maxDisplayDigits)
    );
    if (
      String(processedText).replace(".", "").replace("-", "").length >
      maxDisplayDigits
    ) {
      processedText = DecimalPrecision.floor(
        Number(processedText),
        -1
      ).toExponential();
    }
    // console.log(
    //   String(processedText).replace(".", "").replace("-", "").length >
    //     maxDisplayDigits
    // );
    if (
      String(processedText).replace(".", "").replace("-", "").length >
      maxDisplayDigits + 3
    ) {
      processedText = "TOO HARD";
    }

    //   // Number(processedText).toExponential();
    // while (processedText % 1) {
    // processedText = processedText - (processedText % 1);
    // }
    // 99,999,999,999,999,999

    // if (
    // String(processedText).replace(".", "").replace("-", "").length >
    // maxDisplayDigits + 2
    // ) {

    // }
    // "-9876543.211"
    // -9876543.211
    // }

    display.textContent = processedText;
  }

  switch (context) {
    case "hitDigit":
    case "posNeg":
    case "percent":
      if (register === "aRegister") {
        if (a) setDisplay(a);
        // else display.textContent = "0";
        return;
      }
      if (b) setDisplay(b);
      // else display.textContent = "0";
      break;

    case "evaluate":
      if (a) setDisplay(a);
      break;

    case "clear":
    case "hitZeroWhenZero":
      setDisplay("0");
      break;

    case "divZero":
      setDisplay("U R DRUNK");
      break;

    default:
      break;
  }
  // console.log(a, b, operator, register, replaceMode);
}

// Display max 9 digits
// function maxNine(n) {
//   const abs = Number.abs(n);
//   const maxDigits = 9;
//   let leftDigits;
//   let rightDigits;
//   if (abs < 1000000000) {
//     leftDigits = 9;
//     // 987654321 round to no decimal places
//   }
//   if (abs < 100000000) {
//     leftDigits = 8;
//     // 98765432.1 round to 1
//   }
//   if (abs < 10000000) {
//     leftDigits = 7;
//     // 9876543.21 round to 2
//   }
//   if (abs < 1000000) {
//     leftDigits = 6;
//     // 987654.321 round to 3
//   }
//   if (abs < 100000) {
//     leftDigits = 5;
//     // 98765.4321 round to 4
//   }
//   if (abs < 10000) {
//     leftDigits = 4;
//     // 9876.54321 round to 5
//   }
//   if (abs < 1000) {
//     leftDigits = 3;
//     // 987.654321 round to 6
//   }
//   if (abs < 100) {
//     leftDigits = 2;
//     // 98.7654321 round to 7 decimal places
//   }
//   if (abs < 10) {
//     leftDigits = 1;
//     // 9.87654321 round to 8 decimal places
//   }

//   rightDigits = maxDigits - leftDigits;
// }
