// some constants
const syntax_err_msg = "Syntax error\n[C] : Continue";
const calc_div = document.getElementById("calculator");
const hangman_div = document.getElementById("hangman");
const display = document.getElementById("display");
const hangman_img = document.getElementById("hangman_img");
const hangman_lbl = document.getElementById("hangman_text");
const hangman_sub = document.getElementById("hangman_subtitle");
const hangman_res = document.getElementById("hangman_input");

// find all buttons
const normal_btns = document.getElementsByClassName("button");
const special_btns = document.getElementsByClassName("special_btn");
const equal_btn = document.getElementById("equal_btn");
const hangman_btns = document.getElementsByClassName("hangman_button");

hangman_mode = false;

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
        if (hangman_mode) {hangman_add_key(event.key);}
      case "x":
      case "%":
      case "+":
      case "-":
        if (!hangman_mode){display.innerHTML += event.key;}
        break;
      case "*":
        if (!hangman_mode){display.innerHTML += "x";}
        break;
      case "/":
        if (!hangman_mode){display.innerHTML += "%";}
        break;
      case "=":
      case "Enter":
        if (!hangman_mode){equal_btn_pressed();}
        break;
      case "Backspace":
        if (!hangman_mode){display.innerHTML = display.innerHTML.substring(0, display.innerHTML.length - 1);}
        break;
      case "Escape":
        if (!hangman_mode){display.innerHTML = "";}
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
  if (btn.target.innerText == "<-" && allowFunction()) {
    display.innerHTML = display.innerHTML.substring(0, display.innerHTML.length - 1);
  } else if (btn.target.innerText == "C") {
    display.innerHTML = "";
  }
}

function calculateString(str) {
  // do this cuz -1 = -1 and %4 = 0 is an acceptable result for me
  str = "0" + str;

  let nums = str.split(/[-x\+\%]/);
  nums = nums.filter(num => num);
  let ops = str.split(/[0-9\.]/);
  ops = ops.filter(op => op);

  //check if syntax is correct
  if (nums.length - 1 != ops.length)
    return null;

  let res = nums[0];
  for (let i = 0; i < ops.length; i++) {
    if (ops.indexOf("x") > ops.indexOf("%")) {
      let index = ops.indexOf("x");
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

function equal_btn_pressed() {
  if (display.innerHTML == "" || !allowFunction()) {
    return null;
  } else {
    let res = calculateString(display.innerHTML);
    if (res == null) {
        display.innerHTML = syntax_err_msg;
    } else {
      hangman_setup(res);
    }
  }
}

function hangman_setup(num) {
  num = num.toString();
  display.innerHTML = num;
  hangman_mode = true;
  calc_div.style["display"] = "none";
  hangman_div.style["display"] = "flex";

  for (let i = 0; i < hangman_btns.length; i++) {
    hangman_btns[i].addEventListener('click', hangman_btn_pressed);
  }

  hangman_res.innerText = num.replace(/./g, "_");
}

function hangman_after() {
  for (let i = 0; i < hangman_btns.length; i++) {
    hangman_btns[i].classList.remove("hangman_button_disabled");
  }
  hangman_img.removeEventListener('click', hangman_after);
  calc_div.style["display"] = "grid";
  hangman_div.style["display"] = "none";
  hangman_mode = false;
  hangman_sub.innerHTML = "";
  img_src = hangman_img.src.split("-");
  img_src[img_src.length - 2] = "0";
  hangman_img.src = img_src.join("-");
}

function hangman_btn_pressed(btn) {
  hangman_add_key(btn.target.innerText);
}

function hangman_add_key(key) {
  let index = 0;
  switch (key) {
    case ".":
      index = 10;
      break;
    case "0":
      index = 9;
      break;
    default:
      index = parseInt(key) - 1;
      break;
  }
  hangman_btns[index].removeEventListener('click', hangman_btn_pressed);
  hangman_btns[index].classList.add("hangman_button_disabled");

  let num = display.innerHTML;
  let res = hangman_res.innerText;

  let i = num.indexOf(key);
  while(i != -1) {
    /*
     *          WHY JAVASCRIPT???
     * why do strings HAVE to be immutable?
     */
    num = num.substring(i + 1);
    res = res.substring(0, i) + key + res.substring(i + 1);
    i = num.indexOf(key);
  }
  if (res != hangman_res.innerText) {
    hangman_res.innerText = res;
    if (hangman_res.innerText.indexOf("_") == -1) {
      hangman_lbl.innerHTML = "WOW...\nThat was just an easy one";
      hangman_sub.innerHTML = "Click on the man you saved to go back";
      hangman_img.addEventListener('click', hangman_after);
      for (let i = 0; i < hangman_btns.length; i++) {
        hangman_btns[i].removeEventListener('click', hangman_btn_pressed);
      }
    }
  } else {
    img_src = hangman_img.src.split("-");
    newIndex =  parseInt(img_src[img_src.length - 2]) + 1;
    img_src[img_src.length - 2] = newIndex;
    hangman_img.src = img_src.join("-");

    if (newIndex == 5) {
      hangman_lbl.innerHTML = "And now he's dead. You should be ashamed of yourself.";
      hangman_sub.innerHTML = "Click on the man you killed to go back"
      hangman_img.addEventListener('click', hangman_after);
      display.innerHTML = "";
      for (let i = 0; i < hangman_btns.length; i++) {
        hangman_btns[i].removeEventListener('click', hangman_btn_pressed);
      }
    }
  }
}
