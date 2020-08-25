let buttons = document.querySelectorAll("button");
let currCalc = document.querySelector(".current-calculation"); // lower portion of the display wehere the user inputs new data
let prevCalc = document.querySelector(".previous-calculations"); // upper part of the display
let currInput = "";
let finalResult;
let operatorsCounter = 0;
let numbers = [];
let currOperator = [];
let operatorSequence = [];

buttons.forEach((e) => {
  e.addEventListener("click", input);
});

function input(e) {
  let inputType = Object.keys(e.target.dataset)[0];
  let inputValue = Object.values(e.target.dataset)[0];
  currCalc.textContent = '';

  switch (inputType) {
    case "clear":
      currOperator = [];
      numbers = [];
      prevCalc.textContent = "";
      currCalc.textContent = "";
      break;
    case "delete":
      currCalc.textContent = "";
      break;
    case "operator":
      operatorsCounter++;
      operatorSequence.push(inputValue);
      operatorCalculation(inputValue);
      break;
    default:
      currInput += inputValue;
      currCalc.textContent += currInput;
      break;
  }
}

function operatorCalculation(operator) {
  // not all operator values match their 'real world' counterparts, updates the upper line accordingly
  switch (operator) {
    case "=":
      if (currInput != 0) {
        updatePreviousCalculation(currInput);
      } else return;
      if (currOperator.length == 0) {
        currOperator.push(operatorSequence[operatorSequence.length - 1]);
      }
      pushToNumbers(currInput);
      calculate();
      updateCurrCalc(finalResult);
      break;
    case "sq":
      if (operatorsCounter == 1) {
        pushToNumbers(currInput);
        currOperator.push(operator);
      } else if ((operatorSequence[operatorSequence.length - 2] == '=') || (operatorSequence[operatorSequence.length - 1] == '=')) {
        pushToNumbers(multiply(finalResult, finalResult));
        finalResult = multiply(finalResult, finalResult)
        prevCalc.textContent = '';
        updatePreviousCalculation(finalResult);
        updatePreviousCalculation("²");
        return updateCurrCalc(finalResult);
      } else {
        pushToNumbers(multiply(currInput, currInput));
        currOperator[0] = operatorSequence[operatorSequence.length - 2];
      }
      updatePreviousCalculation(currInput);
      updatePreviousCalculation("²");
      calculate();
      updateCurrCalc(finalResult);
      break;
    case "sqrt":
      if (operatorsCounter == 1) {
        pushToNumbers(currInput);
        currOperator.push(operator);
      } else if ((operatorSequence[operatorSequence.length - 2] == '=') || (operatorSequence[operatorSequence.length - 1] == '=')) {
        pushToNumbers(squareRoot(finalResult));
        finalResult = squareRoot(finalResult)
        prevCalc.textContent = '';
        updatePreviousCalculation("√");
        updatePreviousCalculation(finalResult);
        return updateCurrCalc(finalResult);
      } else {
        pushToNumbers(squareRoot(currInput));
        currOperator[0] = operatorSequence[operatorSequence.length - 2];
      }
      updatePreviousCalculation("√");
      updatePreviousCalculation(currInput);
      calculate();
      updateCurrCalc(finalResult);
      break;
    default:
      pushToNumbers(currInput);
      currOperator.push(operator);
      updatePreviousCalculation(currInput);
      updatePreviousCalculation(operator);
      if (numbers.length > 1) {
        calculate();
      } else {
        // currOperator.push(operator);
      }
      updateCurrCalc(finalResult);
      break;
  }
  currInput = "";
}

function calculate() {
  console.log('-----');
  console.log(`numbers ${numbers}`);
  console.log(`currOperator ${currOperator}`);
  console.log(`operatorSequence ${operatorSequence}`);
  if (currOperator[0] == "sq" || currOperator[0] == "sqrt") {
    finalResult = operationResult(currOperator[0], numbers[0]);
  } else {
    finalResult = operationResult(operatorSequence[operatorSequence.length - 2], numbers[0], numbers[1]);
  }
  numbers[0] = finalResult;
  numbers.splice(1, 1);
  currOperator = [];
  console.log(`numbers ${numbers}`);
  console.log(`currOperator ${currOperator}`);
  console.log(`operatorSequence ${operatorSequence}`);
  console.log('-----');

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

function updateCurrCalc(e) {
  if (e == undefined) {
    return;
  }
   else if (e.toString().includes(".")) {
    currCalc.textContent = e.toFixed(2);
  } else {
    currCalc.textContent = e;
  }
  // currCalc.textContent = finalResult;
}

function pushToNumbers(e) {
  if (currInput != 0) {   //changed from currCalc.textcontent to currninput because I keep forgetting that I have that
    numbers.push(Number(e));
    currCalc.textContent = "";
  } else return;
}

// round numbers to 2 decimal places - done
// if previous calculations exceeds max number of chars calcl result, display and disable all buttons aside from C (apply class that changes colour)
// overflow of the lower box
// first input cannot be an operator
// clicking an operator after sq or sqrt repeats that action even though currOperator array is empty
// divide by 0