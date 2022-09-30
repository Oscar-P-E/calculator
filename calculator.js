// user clicks a number (5)
// "5" gets assigned to "a", or "b" if "a" already used

// user clicks a number (6)
// "6" gets concatenated to "a" if 5 was just assigned to "a", or "b" if 5 was just assigned to "b"

// user clicks an operator (+)
// "plus" gets assigned to "operator" variable

// user clicks minus
// "minus" gets reassigned to "operator"

// user clicks a number (1)
// "1" gets assigned to "b"

// user clicks an operator (*)
// evaluate 56 - 1 (55)
// assign 55 to a variable ("a"?)
// "operator" reassigned "multiply"

// user clicks a number (2)
// "b" = "2"

// user clicks "="
// evaluate 55 * 2 (110)
// assign 110 to a variable ("a"?)

const numberButtons = document.querySelectorAll(".button .number");
numberButtons.forEach((btn) => {
  btn.addEventListener("click", hitDigit);
});

let a = "";
let b = "";
let operator = "";
let register = "aRegister";

function hitDigit(e) {
  storeDigit(e.target.id);
}

function storeDigit(digit) {
  if (register === "aRegister") {
    a += "" + digit;
    return;
  }
  b += "" + digit;
}

const operatorButtons = document.querySelectorAll(".button .operator");
operatorButtons.forEach((btn) => {
  btn.addEventListener("click", hitOperator);
});

function hitOperator(e) {
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
  switch (operator) {
    case "add":
      add(a, b);
      break;

    case "subtract":
      subtract(a, b);
      break;

    case "multiply":
      multiply(a, b);
      break;

    case "divide":
      divide(a, b);
      break;

    default:
      break;
  }
}

function add() {
  return a + b;
}

function subtract() {
  return a - b;
}

function multiply() {
  return a * b;
}

function divide() {
  if (a === 0 || b === 0) {
    divZero();
    return;
  }
  return a / b;
}

function divZero() {
  clear();
  // To-do: Display "U R DRUNK"
}

function equals() {
  evaluate();
  changeRegister("equals");
}
