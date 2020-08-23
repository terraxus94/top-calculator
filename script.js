let buttons = document.querySelectorAll("button");
let currCalc = document.querySelector(".current-calculation"); // lower portion of the display wehere the user inputs new data
let prevCalc = document.querySelector(".previous-calculations"); // upper part of the display
let numbers = [];
let operators = [];
let operatorsDump = [];
let currInput = "";
let finalResult;

buttons.forEach((e) => {
  e.addEventListener("click", input);
});

function input(e) {
  let inputType = Object.keys(e.target.dataset)[0];
  let inputValue = Object.values(e.target.dataset)[0];

  switch (inputType) {
    case "clear":
      operators = [];
      numbers = [];
      prevCalc.textContent = "";
      currCalc.textContent = "";
      break;
    case "delete":
      currCalc.textContent = "";
      break;
    case "operator":
      operatorsDump.push(inputValue);
      operatorCalculation(inputValue);
      break;
    default:
      currCalc.textContent += inputValue;
      currInput += inputValue;
      break;
  }
}

function operatorCalculation(operator) {
  // not all operator values match their 'real world' counterparts, updates the upper line accordingly
  switch (operator) {
    case "=":
      if (currCalc.textContent != 0) {
        updatePreviousCalculation(currInput);
      } else return;
      if (operators.length == 0) {
        operators.push(operatorsDump[operatorsDump.length - 1])
      }
      pushToNumbers(currInput);
      calculate();
      currCalc.textContent = finalResult;
      break;
    case "sq":
      pushToNumbers(currInput);
      operators.push(operator);
      if (currCalc.textContent == "") {
        currInput = numbers[0];
        prevCalc.textContent = "";
      }
      updatePreviousCalculation(currInput);
      updatePreviousCalculation("²");
      calculate();
      currCalc.textContent = finalResult;
      break;
    case "sqrt":
      pushToNumbers(currInput);
      operators.push(operator);
      updatePreviousCalculation("√");
      if (currCalc.textContent == "") {
        currInput = numbers[0];
        prevCalc.textContent = "";
      }
      updatePreviousCalculation(currInput);
      calculate();
      currCalc.textContent = finalResult;
      break;
    default:
      pushToNumbers(currInput);
      operators.push(operator);
      updatePreviousCalculation(currInput);
      updatePreviousCalculation(operator);
      if (numbers.length > 1) {
        calculate();
      } else {
        operators.push(operator)
      }
      currCalc.textContent = finalResult;

      break;
  }
  currInput = "";
}

function calculate() {
  if (operators[0] == "sq" || operators[0] == "sqrt") {
    finalResult = operationResult(operators[0], numbers[0]);
  } else {
    finalResult = operationResult(operatorsDump[operatorsDump.length - 2], numbers[0], numbers[1]);
  }
  numbers[0] = finalResult;
  numbers.splice(1, 1);
  operators = [];
  console.log(numbers);
}

function operationResult(operator, a, b = a) {
  switch (operator) {
    case "+":
      return sum(a, b);
      break;
    case "-":
      return subtract(a, b);
      break;
    case "x":
      return multiply(a, b);
      break;
    case "÷":
      return divide(a, b);
      break;
    case "sq":
      return multiply(a, a);
      break;
    case "sqrt":
      return squareRoot(a);
      break;
    default:
      console.log("Something went very wrong");
      break;
  }

  // revisit this part
  // if (operations[0].toString().includes(".")) {
  //   currCalc.textContent = operations[0].toFixed(2);
  // } else {
  //   currCalc.textContent = operations[0];
  // }
}

function updatePreviousCalculation(a) {
  return (prevCalc.textContent += a);
}

function sum(a, b) {
  return Number(a) + Number(b);
}

function subtract(a, b) {
  return Number(a) - Number(b);
}

function multiply(a, b) {
  return Number(a) * Number(b);
}

function divide(a, b) {
  return Number(a) / Number(b);
}

function squareRoot(a) {
  return Math.sqrt(Number(a));
}

function pushToNumbers(e) {
  if (currCalc.textContent != 0) {
    numbers.push(Number(e));
    currCalc.textContent = "";
  } else return;
}

// round numbers to 2 decimal places - done
// if previous calculations exceeds max number of chars calcl result, display and disable all buttons aside from C (apply class that changes colour)
// overflow of the lower box
// first input cannot be an operator
// clicking an operator after sq or sqrt repeats that action even though operators array is empty