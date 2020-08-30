let buttons = document.querySelectorAll("button");
let currCalc = document.querySelector(".current-calculation"); // lower portion of the display 
let prevCalc = document.querySelector(".previous-calculations"); // upper part of the display
let finalResult, inputType, inputValue, keyboardType, keyboardValue, wasOverflowed;
let operators = '=+-xsqsqrt÷';
let numbers = '1234567890.'
let clickCounter = 0;
let operatorsCounter = 0;
let currCalcLimit = 17;
let prevCalcLimit = 25;
let isKeyboardInput = false;
let currInput = '';
let numberSequence = [];
let currOperator = [];
let operatorSequence = [];
let inputSequence = [];

document.addEventListener('keydown', e => {
  keyboardInput(e.key);
})

function keyboardInput(e) {
  isKeyboardInput = true
  if ((e == 's') || (e == 'q') || (e == 'r') || (e == 't')) {
    return;
  }

  if (numbers.includes(e)) {
    keyboardType = 'number';
    keyboardValue = e;
    eventCleanup();

  }

  if (e == 'Delete') {
    keyboardType = 'clear';
    keyboardValue = e;
    eventCleanup();

  }

  if (e == 'Backspace') {
    keyboardType = 'delete';
    keyboardValue = e;
    eventCleanup();

  }

  if (operators.includes(e)) {
    keyboardType = 'operator';
    keyboardValue = e;
    eventCleanup();

  }

  if (e == '/') {
    keyboardType = 'operator';
    keyboardValue = '÷';
    eventCleanup();

  }

  if (e == 'Enter') {
    keyboardType = 'operator';
    keyboardValue = '=';
    eventCleanup();
  }
}

buttons.forEach((e) => {
  e.addEventListener("click", e => {
    isKeyboardInput = false;
    eventCleanup(e);
  });
});

function eventCleanup(e) {
  if (wasOverflowed) {
    resetEverything();
    wasOverflowed = false;
  }
  if (currCalc.textContent == 'Error') {
    resetEverything();
  }

  if (isKeyboardInput) {
    inputType = keyboardType;
    inputValue = keyboardValue;
  } else {
    inputType = Object.keys(e.target.dataset)[0];
    inputValue = Object.values(e.target.dataset)[0];
  }
  isKeyboardInput = false;

  if (currInput.length >= currCalcLimit) {
    if (inputType == 'operator') {
      input(inputType, inputValue);
      clickCounter++;
    }
  } else if (currCalc.textContent == '') {
    if (inputType == 'number') {
      input(inputType, inputValue);
      clickCounter++;
    }
  } else if (currInput != '') {
    input(inputType, inputValue);
    clickCounter++;
  } else if (!isNaN(inputSequence[inputSequence.length - 1])) {
    if (inputType == 'operator') {
      input(inputType, inputValue);
      clickCounter++;
    }
  } else if (inputSequence[inputSequence.length - 1] == '=') {
    if (inputType == 'operator') {
      input(inputType, inputValue);
      clickCounter++;
    }
  }
  else if (operators.includes(inputSequence[inputSequence.length - 1])) {
    if (inputType == 'number') {
      input(inputType, inputValue);
      clickCounter++;
    }
  }
  limitOverflow(); //might not be the best position for this
}

function input(type, value) {
  currCalc.textContent = '';
  switch (type) {
    case "clear":
      resetEverything();
      break;
    case "delete":
      currInput = '';
      currCalc.textContent = "";
      break;
    case "operator":
      if (currInput != '') {
        inputSequence.push(currInput);
      }
      inputSequence.push(value)
      operatorsCounter++;
      operatorSequence.push(value);
      operatorCalculation(value);
      break;
    default:
      if ((value == '.') && (currInput.includes('.'))) {
        currCalc.textContent = currInput;
      } else {
        currInput += value;
        currCalc.textContent += currInput;
      }
      break;
  }
}

function operatorCalculation(operator) {
  // not all operator values match their 'real world' counterparts, updates the upper line accordingly
  switch (operator) {
    case "=":
      if (currInput != '') {
        updatePrevCalc(currInput);
      } else return;
      if (currOperator.length == 0) {
        currOperator.push(operatorSequence[operatorSequence.length - 1]);
      }
      pushToNumbers(currInput);
      calculate();
      if (!(currCalc.textContent == 'Error')) {
        updateCurrCalc(finalResult);
      }
      inputSequence.push(finalResult);
      break;
    case "sq":
      prevCalc.textContent = '';
      if (operatorsCounter == 1) {
        pushToNumbers(currInput);
        currOperator.push(operator);
      } else if ((operatorSequence[operatorSequence.length - 2] == '=') || (operatorSequence[operatorSequence.length - 1] == '=') || (operatorSequence[operatorSequence.length - 2] == 'sq')) {
        pushToNumbers(multiply(finalResult, finalResult));
        updatePrevCalc(finalResult);
        updatePrevCalc("²");
        finalResult = multiply(finalResult, finalResult)
        inputSequence.push(finalResult);
        return updateCurrCalc(finalResult);
      } else {
        pushToNumbers(multiply(currInput, currInput));
        currOperator[0] = operatorSequence[operatorSequence.length - 2];
      }
      updatePrevCalc(currInput);
      updatePrevCalc("²");
      calculate();
      updateCurrCalc(finalResult);
      inputSequence.push(finalResult);
      break;
    case "sqrt":
      prevCalc.textContent = '';
      if (operatorsCounter == 1) {
        pushToNumbers(currInput);
        currOperator.push(operator);
      } else if ((operatorSequence[operatorSequence.length - 2] == '=') || (operatorSequence[operatorSequence.length - 1] == '=') || (operatorSequence[operatorSequence.length - 2] == 'sqrt')) {
        pushToNumbers(squareRoot(finalResult));
        updatePrevCalc("√");
        updatePrevCalc(finalResult);
        finalResult = squareRoot(finalResult)
        inputSequence.push(finalResult);
        return updateCurrCalc(finalResult);
      } else {
        pushToNumbers(squareRoot(currInput));
        currOperator[0] = operatorSequence[operatorSequence.length - 2];
      }
      updatePrevCalc("√");
      updatePrevCalc(currInput);
      calculate();
      updateCurrCalc(finalResult);
      inputSequence.push(finalResult);
      break;
    default:
      pushToNumbers(currInput);
      currOperator.push(operator);
      updatePrevCalc(currInput);
      updatePrevCalc(operator);
      if (numberSequence.length > 1) {
        calculate();
      };
      updateCurrCalc(finalResult);
      break;
  }
  currInput = "";
}

function calculate() {
  if (currOperator[0] == "sq" || currOperator[0] == "sqrt") {
    finalResult = operationResult(currOperator[0], numberSequence[0]);
  } else {
    if (((numberSequence[1] == 0) || (numberSequence[1] == '0')) && (operatorSequence[operatorSequence.length - 2] == '÷')) {
      currCalc.innerHTML = "<span class='error'>Error</span>";
      return;
    }
    finalResult = operationResult(operatorSequence[operatorSequence.length - 2], numberSequence[0], numberSequence[1]);
  }
  numberSequence[0] = finalResult;
  numberSequence.splice(1, 1);
  currOperator = [];
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

function updatePrevCalc(e) {
  if (e == undefined) {
    return;
  } else if (e.toString().includes('.')) {
    prevCalc.textContent += Number(e).toFixed(2);
  } else {
    prevCalc.textContent += e;
  }

}

function updateCurrCalc(e) {
  if (e == undefined) {
    return;
  } else if (e.toString().includes('.')) {
    currCalc.textContent = e.toFixed(2);
  } else {
    currCalc.textContent = e;
  }
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
  if (e != '') {
    numberSequence.push(Number(e));
    currCalc.textContent = '';
  } else return;
}

function limitOverflow() {
  if ((currInput.length + prevCalc.textContent.length) >= prevCalcLimit) { //checks whether the number currently being entered is going to overflow
    fakeEqualsClick();
    wasOverflowed = true;
  }
}

function fakeEqualsClick() {
  if (currInput != '') {
    inputSequence.push(currInput);
  }
  inputSequence.push('=')
  operatorsCounter++;
  operatorSequence.push('=');
  operatorCalculation('=');
}

function resetEverything() {
  currCalc.textContent = '';
  prevCalc.textContent = '';
  operatorsCounter = 0;
  clickCounter = 0;
  numberSequence = [];
  currOperator = [];
  operatorSequence = [];
  currInput = '';
  currOperator = [];
  finalResult = '';
}


// to do
// find out how to write tests for this
// if (reader.name == 'duda') {how often to functionalise a certain thing? for example checking if e is number or operator or smt?}
// repeated squaring leads to overflow
// sqrt sq one after another don't work