import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

var inputString =
  "input:not([type=checkbox]):not([type=radio]), select, textarea";

function initializeLabel(label) {
  // then we need to check if the layout is compatible
  let child = label.querySelector("input, select, textarea") || false;

  if (child) {
    let placeholder = child.placeholder || false;
    let tagName = child.tagName;

    if (placeholder || tagName === "Select") {
      label.classList.add("permanent-active");
    }

    // and make it active if it has a value
    if (child.value !== "") {
      label.classList.add("active");
    }
  }

  label.dataset.labelInit = true;
}

function initializeLabels() {
  let labels = document.querySelectorAll("label:not([data-label-init])");

  labels.forEach(function (label) {
    initializeLabel(label);
  });
}

addEventDelegate("load", window, initializeLabels);

function selectInputLabel(input) {
  let label = input.parentNode;

  label.classList.add("active");

  // add contextual class for currency
  if (!label.classList.contains("currency")) {
    if (input.classList.contains("currency")) {
      label.classList.add("currency");
    }
  }
}

function deselectInputLabel(input) {
  let label = input.parentNode;

  if (input.value === "") {
    label.classList.remove("active");
  }
}

addEventDelegate("focusin", inputString, selectInputLabel);
addEventDelegate("focusout", inputString, deselectInputLabel);

// cool click event
function getPseudoXPos(target, event) {
  let clientX = event.clientX;
  let elemX = target.getBoundingClientRect().left;
  let xPos = clientX - elemX;
  document.documentElement.style.setProperty(
    "--label-before-left",
    xPos + "px"
  );
}

addEventDelegate(
  "click",
  "label:not([for]):not(.codebase-incompatible)",
  getPseudoXPos
);

const toggleVisibilityWithSelect = (selectInput) => {
  const query = selectInput.dataset.targets,
    value = selectInput.value,
    targets = document.querySelectorAll(query);

  targets.forEach((target) => {
    if (target.classList.contains(value)) {
      target.classList.add("visible");
    } else {
      target.classList.remove("visible");
    }
  });
};

// make the first hidden input group visible
const firstHiddenInputGroups = document.querySelectorAll(
  ".hidden-input-group:nth-of-type(1)"
);

if (firstHiddenInputGroups.length > 0) {
  firstHiddenInputGroups.forEach((firstHiddenInputGroup) => {
    firstHiddenInputGroup.classList.add("visible");
  });
}

addEventDelegate("change", "select[data-targets]", toggleVisibilityWithSelect);

const toggleVisibilityWithCheckbox = (checkbox) => {
  const query = checkbox.dataset.targets,
    checked = checkbox.checked,
    targets = document.querySelectorAll(query);

  targets.forEach((target) => {
    if (checked) {
      target.classList.remove("hidden");
    } else {
      target.classList.add("hidden");
    }
  });
};

addEventDelegate(
  "change",
  "input[type='checkbox'][data-targets]",
  toggleVisibilityWithCheckbox
);

// handle base64 image inputs
const imageToBase64 = (input) => {
  if (!input.files || !input.files[0]) return;

  const FR = new FileReader();

  FR.addEventListener("load", (evt) => {
    const hiddenInput = input.parentNode.nextElementSibling,
      imagePreview = input.parentNode.previousElementSibling;

    hiddenInput.value = evt.target.result;
    imagePreview.src = evt.target.result;
  });

  FR.readAsDataURL(input.files[0]);
};

addEventDelegate("change", ".base64ImageInput input.imageFile", imageToBase64);

// FormAT PHONE NUMBERS
// borrowed from http://www.kodyaz.com
// and slightly modified to add space between
// area code and rest of number

var zChar = new Array(" ", "(", ") ", "-", ".");
var maxphonelength = 14;
var phonevalue1;
var phonevalue2;
var cursorposition;

function ParseForNumber1(object) {
  phonevalue1 = ParseChar(object.value, zChar);
}

function ParseForNumber2(object) {
  phonevalue2 = ParseChar(object.value, zChar);
}

function backspacerUP(object, e) {
  var keycode;

  if (e) {
    e = e;
  } else {
    e = window.event;
  }

  if (e.which) {
    keycode = e.which;
  } else {
    keycode = e.keyCode;
  }

  ParseForNumber1(object);

  if (keycode >= 48) {
    ValidatePhone(object);
  }
}

function backspacerDOWN(object, e) {
  var keycode;

  if (e) {
    e = e;
  } else {
    e = window.event;
  }
  if (e.which) {
    keycode = e.which;
  } else {
    keycode = e.keyCode;
  }

  ParseForNumber2(object);
}

function GetCursorPosition() {
  var t1 = phonevalue1;
  var t2 = phonevalue2;
  var bool = false;
  for (let i = 0; i < t1.length; i++) {
    if (t1.substring(i, 1) !== t2.substring(i, 1)) {
      if (!bool) {
        cursorposition = i;
        bool = true;
      }
    }
  }
}

function ValidatePhone(object) {
  var p = phonevalue1,
    pp;

  p = p.replace(/[^\d]*/gi, "");

  if (p.length < 3) {
    object.value = p;
  } else if (p.length === 3) {
    pp = p;
    let d4 = p.indexOf("(");
    let d5 = p.indexOf(")");
    if (d4 === -1) {
      pp = "(" + pp;
    }
    if (d5 === -1) {
      pp = pp + ") ";
    }
    object.value = pp;
  } else if (p.length > 3 && p.length < 7) {
    p = "(" + p;
    let l30 = p.length;
    let p30 = p.substring(0, 4);
    p30 = p30 + ") ";

    let p31 = p.substring(4, l30);
    pp = p30 + p31;

    object.value = pp;
  } else if (p.length >= 7) {
    p = "(" + p;
    let l30 = p.length;
    let p30 = p.substring(0, 4);
    p30 = p30 + ") ";

    let p31 = p.substring(4, l30);
    pp = p30 + p31;

    let l40 = pp.length;
    let p40 = pp.substring(0, 9);
    p40 = p40 + "-";

    let p41 = pp.substring(9, l40);
    let ppp = p40 + p41;

    object.value = ppp.substring(0, maxphonelength);
  }

  GetCursorPosition();

  if (cursorposition >= 0) {
    if (cursorposition === 0) {
      cursorposition = 2;
    } else if (cursorposition <= 2) {
      cursorposition = cursorposition + 1;
    } else if (cursorposition <= 5) {
      cursorposition = cursorposition + 2;
    } else if (cursorposition === 6) {
      cursorposition = cursorposition + 2;
    } else if (cursorposition === 7) {
      cursorposition = cursorposition + 4;
      let e1 = object.value.indexOf(")");
      let e2 = object.value.indexOf("-");
      if (e1 > -1 && e2 > -1) {
        if (e2 - e1 === 4) {
          cursorposition = cursorposition - 1;
        }
      }
    } else if (cursorposition < 11) {
      cursorposition = cursorposition + 3;
    } else if (cursorposition === 11) {
      cursorposition = cursorposition + 1;
    } else if (cursorposition >= 12) {
      cursorposition = cursorposition;
    }
  }
}

function ParseChar(sStr, sChar) {
  let sNewStr;

  if (sChar.length === null) {
    zChar = new Array(sChar);
  } else zChar = sChar;

  for (let i = 0; i < zChar.length; i++) {
    sNewStr = "";

    var iStart = 0;
    var iEnd = sStr.indexOf(sChar[i]);

    while (iEnd !== -1) {
      sNewStr += sStr.substring(iStart, iEnd);
      iStart = iEnd + 1;
      iEnd = sStr.indexOf(sChar[i], iStart);
    }

    sNewStr += sStr.substring(sStr.lastIndexOf(sChar[i]) + 1, sStr.length);

    sStr = sNewStr;
  }

  return sNewStr;
}

addEventDelegate("keydown", "input[type=tel]", backspacerDOWN);
addEventDelegate("keyup", "input[type=tel]", backspacerUP);

// CURRENCY FormATTER

Number.prototype.countDecimals = function () {
  if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
  return this.toString().split(".")[1].length || 0;
};

function formatCurrency(input, event) {
  let value = input.value;
  let values = value.split(".");

  if (values.length > 1) {
    // we have decimals

    // first, make sure that the decimals
    // are not longer than two
    if (values[1].length > 2) {
      // reduce it to two
      values[1] = values[1].slice(0, 2);
    }
  }

  if (event.type === "focusout") {
    if (value !== "") {
      if (values.length > 1) {
        if (values[1].length < 2) {
          values[1] += "0";
        }
      } else {
        values[1] = "00";
      }
    }
  }

  if (values.length > 1) {
    input.value = values[0] + "." + values[1];
  }
}

addEventDelegate("keyup", "input.currency", formatCurrency);
addEventDelegate("focusout", "input.currency", formatCurrency);

// SSN FormATTER
//jsfiddle.net/hughdidit/Y5SK6/

function trapKeypress(event) {
  // trap keypress
  var character = String.fromCharCode(event.which);
  if (!isInteger(character)) {
    return false;
  }
}

// checks that an input string is an integer, with an optional +/- sign character
function isInteger(s) {
  if (s === "-") return true;
  var isInteger_re = /^\s*(\+|-)?\d+\s*$/;
  return String(s).search(isInteger_re) != -1;
}

// format SSN
function formatSSN(input) {
  // first, add a maxlength of 11 if it hasn't
  // already been added

  if (input.maxLength === -1) {
    input.maxLength = 11;
  }

  var val = input.value.replace(/\D/g, "");
  var newVal = "";
  if (val.length > 4) {
    this.value = val;
  }
  if (val.length > 3 && val.length < 6) {
    newVal += val.substr(0, 3) + "-";
    val = val.substr(3);
  }
  if (val.length > 5) {
    newVal += val.substr(0, 3) + "-";
    newVal += val.substr(3, 2) + "-";
    val = val.substr(5);
  }
  newVal += val;
  input.value = newVal;
}

addEventDelegate("keyup", "input.ssn", formatSSN);
addEventDelegate("keypress", "input.ssn", trapKeypress);
