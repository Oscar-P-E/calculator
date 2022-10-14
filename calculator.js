const html = document.querySelector("html");
// const calculator = document.querySelector(".calculator");
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

operatorButtons.forEach((btn) => {
    btn.addEventListener("click", hitOperator);
});

function hitOperator(e) {
    replaceMode = false;
    // We want to evaluate the expression from left to right in pairs as we go
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
        Math.trunc = function(v) {
            return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
    }
    var powers = [
        1, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13,
        1e14, 1e15, 1e16, 1e17, 1e18, 1e19, 1e20, 1e21, 1e22,
    ];
    var intpow10 = function(power) {
        if (power < 0 || power > 22) {
            return Math.pow(10, power);
        }
        return powers[power];
    };
    var isRound = function(num, decimalPlaces) {
        //return decimalPlaces >= 0 &&
        //    +num.toFixed(decimalPlaces) === num;
        var p = intpow10(decimalPlaces);
        return Math.round(num * p) / p === num;
    };
    var decimalAdjust = function(type, num, decimalPlaces) {
        if (type !== "round" && isRound(num, decimalPlaces || 0)) return num;
        var p = intpow10(decimalPlaces || 0);
        var n = num * p * (1 + Number.EPSILON);
        return Math[type](n) / p;
    };
    return {
        // Decimal round (half away from zero)
        round: function(num, decimalPlaces) {
            return decimalAdjust("round", num, decimalPlaces);
        },
        // Decimal ceil
        ceil: function(num, decimalPlaces) {
            return decimalAdjust("ceil", num, decimalPlaces);
        },
        // Decimal floor
        floor: function(num, decimalPlaces) {
            return decimalAdjust("floor", num, decimalPlaces);
        },
        // Decimal trunc
        trunc: function(num, decimalPlaces) {
            return decimalAdjust("trunc", num, decimalPlaces);
        },
        // Format using fixed-point notation
        toFixed: function(num, decimalPlaces) {
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
    return DecimalPrecision.round(input, maxDecimalLength);
}

function updateDisplay(context) {
    function setDisplay(text) {
        let processedText;
        if (text === "U R DRUNK") {
            display.textContent = "U R DRUNK";
            return;
        }
        if (
            display.classList.contains("small-text", "smaller-text", "smallest-text")
        ) {
            display.classList.remove("small-text");
            display.classList.remove("smaller-text");
            display.classList.remove("smallest-text");
        }
        /*
         * Accurate rounding - gets most of the job done
         */
        processedText = fitToMax(
            Number(text),
            calcMaxDecimalLength(text, maxDisplayDigits)
        );
        if (
            String(processedText).replace(".", "").replace("-", "").length >
            maxDisplayDigits
        ) {
            /*
             * Rough rounding, to differently round the values that the above gets wrong
             */
            processedText = DecimalPrecision.floor(
                Number(processedText),
                -1
            ).toExponential();
        }
        if (
            String(processedText).replace(".", "").replace("-", "").length >
            maxDisplayDigits + 4 ||
            isNaN(processedText)
        ) {
            /*
             * Now we start to use exponent form, using crude rounding because accuracy is low at this stage
             */
            processedText = Math.round(Number(processedText)).toExponential();
        }
        if (
            String(processedText).replace(".", "").replace("-", "").length >
            maxDisplayDigits + 4 ||
            isNaN(processedText)
        ) {
            /*
             * To be honest I'm just trying to catch as many crazy edge cases as I can here.
             * I should have just used .split .slice .join and been done with it a long time ago
             */
            processedText = DecimalPrecision.floor(
                Number(processedText),
                -1
            ).toExponential();
        }
        /*
         * Now we stylishly give up. Alternatively we could google some library that gracefully handles big floats
         */
        if (isNaN(processedText)) {
            processedText = "TOO HARD";
        }
        if (String(processedText).length > maxDisplayDigits) {
            display.classList.add("small-text");
            html.classList.add("danger-1");
        }
        if (String(processedText).length > maxDisplayDigits + 6) {
            display.classList.add("smaller-text");
            html.classList.add("danger-2");
            buttons.forEach((btn) => {
                btn.classList.add("danger-2", "danger-text");
            });
            display.classList.add("display-danger-text");
        }
        if (String(processedText).length > maxDisplayDigits + 10) {
            display.classList.add("smallest-text");
        }
        if (
            register === "aRegister" &&
            String(processedText).length < maxDisplayDigits + 1 &&
            String(processedText) !== "Infinity" &&
            String(processedText) !== "-Infinity"
        ) {
            display.classList.remove("display-danger-text");
            html.classList.remove("danger-1", "danger-2");
            buttons.forEach((btn) => {
                btn.classList.remove("danger-2", "danger-text");
            });
        }
        display.textContent = processedText;
    }

    switch (context) {
        case "hitDigit":
        case "posNeg":
        case "percent":
            if (register === "aRegister") {
                if (a) setDisplay(a);
                return;
            }
            if (b) setDisplay(b);
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
}
