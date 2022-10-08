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
  storeDigit(e.target.textContent);
}

function storeDigit(digit) {
  if (register === "aRegister") {
    a += "" + digit;
    updateDisplay("hitDigit");
    return;
  }
  b += "" + digit;
  updateDisplay("hitDigit");
}

buttons.forEach((btn) => {
  btn.addEventListener("click", actuate);
  btn.addEventListener("transitionend", removeActuate);
});

function actuate(e) {
  e.target.classList.add("actuate");
}

function removeActuate(e) {
  if (!e.target.classList.contains("actuate")) return 0;
  this.classList.remove("actuate");
}

document.addEventListener("click", updateHighlight);

function updateHighlight(e) {
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
      if (register === "aRegister") {
        display.textContent = a;
        return;
      }
      display.textContent = b;
      break;

    case "evaluate":
      display.textContent = a;
      break;

    case "clear":
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
