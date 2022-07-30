// some constants
const syntax_err_msg = "Syntax error\n[AC] : Continue";

// find all buttons
const display = document.getElementById("display");
const normal_btns = document.getElementsByClassName("button");
const special_btns = document.getElementsByClassName("special_btn");
const equal_btn = document.getElementById("equal_btn");

// add eventListeners to all buttons
for (let i = 0; i < normal_btns.length; i++) {
  normal_btns[i].addEventListener('click', normal_btn_pressed);
}
for (let i = 0; i < special_btns.length; i++) {
  special_btns[i].addEventListener('click', special_btn_pressed);
}
equal_btn.addEventListener('click', equal_btn_pressed);

//add eventListener to normal keyboard input
document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case ".":
      case "x":
      case "%":
      case "+":
      case "-":
        display.innerHTML += event.key;
        break;
      case "*":
        display.innerHTML += "x";
        break;
      case "/":
        display.innerHTML += "%";
        break;
      case "=":
      case "Enter":
        equal_btn_pressed();
        break;
      case "Backspace":
        display.innerHTML = display.innerHTML.substring(0, display.innerHTML.length - 1);
        break;
      case "Escape":
        display.innerHTML = "";
        break;
    }
})

function allowFunction() {
  if (display.innerHTML == syntax_err_msg) {
    return false;
  } else {
    return true;
  }
}

function normal_btn_pressed(btn) {
  if (allowFunction()) {
    display.innerHTML += btn.target.innerText;
  }
}

function special_btn_pressed(btn) {
  if (btn.target.innerText == "DEL" && allowFunction()) {
    display.innerHTML = display.innerHTML.substring(0, display.innerHTML.length - 1);
  } else if (btn.target.innerText == "AC") {
    display.innerHTML = "";
  }
}

function equal_btn_pressed() {
  if (display.innerHTML == "" || !allowFunction()) {
    return null;
  } else {
    res = calculateString(display.innerHTML);
    if (res == null) {
        display.innerHTML = syntax_err_msg;
    } else {
        // TODO create hangman here
        display.innerHTML = res;
    }
  }
}

function calculateString(str) {
  // do this cuz -1 = -1 and %4 = 0 is an acceptable result for me
  str = "0" + str;

  nums = str.split(/[-x\+\%]/);
  nums = nums.filter(num => num);
  ops = str.split(/[0-9\.]/);
  ops = ops.filter(op => op);

  //check if syntax is correct
  if (nums.length - 1 != ops.length)
    return null;

  let res = nums[0];
  for (let i = 0; i < ops.length; i++) {
    if (ops.indexOf("x") > ops.indexOf("%")) {
      index = ops.indexOf("x");
      res = parseFloat(nums[index]) * parseFloat(nums[index + 1]);
      nums[index] = res;
      nums[index + 1] = res;
      ops[index] = "";
    } else if (ops.indexOf("%") != -1) {
      index = ops.indexOf("%");
      res = parseFloat(nums[index]) / parseFloat(nums[index + 1]);
      nums[index] = res;
      nums[index + 1] = res;
      ops[index] = "";
    } else {
      for (let j = 0; j < ops.length; j++) {
        if (ops[j] == "") {
          continue;
        } else if (ops[j] == "+") {
          res = parseFloat(nums[j]) + parseFloat(nums[j + 1]);
          nums[j] = res;
          nums[j + 1] = res;
          ops[j] = "";
        } else {
          res = parseFloat(nums[j]) - parseFloat(nums[j + 1]);
          nums[j] = res;
          nums[j + 1] = res;
          ops[j] = "";
        }
      }
    }
  }

  // parse and return the result
  return parseFloat(res);
}
